'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ShoppingList, User, Product, Reminder } from './mock-data'

interface AppContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  lists: ShoppingList[]
  reminders: Reminder[]
  refreshLists: () => Promise<void>
  fetchReminders: () => Promise<void>
  addList: (name: string, emoji: string) => Promise<void>
  deleteList: (id: string) => Promise<void>
  addProduct: (listId: string, product: Omit<Product, 'id'>) => Promise<void>
  updateProduct: (listId: string, productId: string, updates: Partial<Product>) => Promise<void>
  deleteProduct: (listId: string, productId: string) => Promise<void>
  toggleProduct: (listId: string, productId: string) => Promise<void>
  addReminder: (r: { title: string; description: string; dueDate: string }) => Promise<void>
  deleteReminder: (id: string) => Promise<void>
  markReminderRead: (id: string) => Promise<void>
  updateProfile: (name: string, avatar: string) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const TOKEN_KEY = 'mercalist-token'
const USER_KEY = 'mercalist-user'
const API_URL = 'http://localhost:8080/api'

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem(TOKEN_KEY)
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    }
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers })
    if (response.status === 401) { logout(); throw new Error('Unauthorized') }
    if (!response.ok) {
      const text = await response.text()
      console.error(`[API Error] ${options.method || 'GET'} ${endpoint} → ${response.status}: ${text}`)
      throw new Error(`API ${response.status}`)
    }
    return response
  }

  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY)
    const token = localStorage.getItem(TOKEN_KEY)
    if (savedUser && token) {
      setUser(JSON.parse(savedUser))
      refreshLists()
      fetchReminders()
    }
    setIsHydrated(true)
  }, [])

  const refreshLists = async () => {
    try {
      const response = await fetchApi('/lists')
      if (response.ok) setLists(await response.json())
    } catch (e) { console.error('refreshLists:', e) }
  }

  const fetchReminders = async () => {
    try {
      const response = await fetchApi('/reminders')
      if (response.ok) setReminders(await response.json())
    } catch (e) { console.error('fetchReminders:', e) }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem(TOKEN_KEY, data.token)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
        setUser(data.user)
        await refreshLists()
        await fetchReminders()
        return true
      }
    } catch (e) { console.error('login:', e) }
    return false
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })
      if (response.ok) return await login(email, password)
    } catch (e) { console.error('register:', e) }
    return false
  }

  const logout = () => {
    setUser(null)
    setLists([])
    setReminders([])
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  const addList = async (name: string, emoji: string) => {
    try {
      const r = await fetchApi('/lists', { method: 'POST', body: JSON.stringify({ name, emoji }) })
      if (r.ok) await refreshLists()
    } catch (e) { console.error('addList:', e) }
  }

  const deleteList = async (id: string) => {
    try {
      const r = await fetchApi(`/lists/${id}`, { method: 'DELETE' })
      if (r.ok) await refreshLists()
    } catch (e) { console.error('deleteList:', e) }
  }

  const addProduct = async (listId: string, product: Omit<Product, 'id'>) => {
    try {
      const r = await fetchApi(`/lists/${listId}/products`, { method: 'POST', body: JSON.stringify(product) })
      if (r.ok) await refreshLists()
    } catch (e) { console.error('addProduct:', e) }
  }

  const updateProduct = async (listId: string, productId: string, updates: Partial<Product>) => {
    try {
      const list = lists.find(l => l.id.toString() === listId)
      const current = list?.products?.find(p => p.id.toString() === productId)
      if (!current) return
      const r = await fetchApi(`/lists/${listId}/products/${productId}`, {
        method: 'PUT', body: JSON.stringify({ ...current, ...updates }),
      })
      if (r.ok) await refreshLists()
    } catch (e) { console.error('updateProduct:', e) }
  }

  const deleteProduct = async (listId: string, productId: string) => {
    try {
      const r = await fetchApi(`/lists/${listId}/products/${productId}`, { method: 'DELETE' })
      if (r.ok) await refreshLists()
    } catch (e) { console.error('deleteProduct:', e) }
  }

  const toggleProduct = async (listId: string, productId: string) => {
    try {
      const list = lists.find(l => l.id.toString() === listId)
      const product = list?.products?.find(p => p.id.toString() === productId)
      if (product) await updateProduct(listId, productId, { purchased: !product.purchased })
    } catch (e) { console.error('toggleProduct:', e) }
  }

  const addReminder = async (r: { title: string; description: string; dueDate: string }) => {
    try {
      const res = await fetchApi('/reminders', { method: 'POST', body: JSON.stringify(r) })
      if (res.ok) await fetchReminders()
    } catch (e) { console.error('addReminder:', e) }
  }

  const deleteReminder = async (id: string) => {
    try {
      const res = await fetchApi(`/reminders/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchReminders()
    } catch (e) { console.error('deleteReminder:', e) }
  }

  const markReminderRead = async (id: string) => {
    try {
      const res = await fetchApi(`/reminders/${id}/read`, { method: 'PATCH' })
      if (res.ok) await fetchReminders()
    } catch (e) { console.error('markReminderRead:', e) }
  }

  const updateProfile = async (name: string, avatar: string) => {
    try {
      const res = await fetchApi('/users/profile', { method: 'PUT', body: JSON.stringify({ name, avatar }) })
      if (res.ok) {
        const data = await res.json()
        const updatedUser = { name: data.name, email: data.email, avatar: data.avatar }
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
        setUser(updatedUser)
      }
    } catch (e) { console.error('updateProfile:', e) }
  }

  if (!isHydrated) return null

  return (
    <AppContext.Provider value={{
      user, isAuthenticated: !!user, login, register, logout,
      lists, reminders, refreshLists, fetchReminders,
      addList, deleteList, addProduct, updateProduct, deleteProduct, toggleProduct,
      addReminder, deleteReminder, markReminderRead, updateProfile,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
