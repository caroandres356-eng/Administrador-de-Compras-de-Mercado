'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ShoppingList, User, Product } from './mock-data'

interface AppContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  lists: ShoppingList[]
  refreshLists: () => Promise<void>
  addList: (name: string, emoji: string) => Promise<void>
  deleteList: (id: string) => Promise<void>
  addProduct: (listId: string, product: Omit<Product, 'id'>) => Promise<void>
  updateProduct: (listId: string, productId: string, updates: Partial<Product>) => Promise<void>
  deleteProduct: (listId: string, productId: string) => Promise<void>
  toggleProduct: (listId: string, productId: string) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const TOKEN_KEY = 'mercalist-token'
const USER_KEY = 'mercalist-user'
const API_URL = 'http://localhost:8080/api'

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem(TOKEN_KEY)
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    }

    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers })
    if (response.status === 401) {
      logout()
      throw new Error('Unauthorized')
    }
    return response
  }

  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY)
    const token = localStorage.getItem(TOKEN_KEY)
    if (savedUser && token) {
      setUser(JSON.parse(savedUser))
      refreshLists()
    }
    setIsHydrated(true)
  }, [])

  const refreshLists = async () => {
    try {
      const response = await fetchApi('/lists')
      if (response.ok) {
        const data = await response.json()
        setLists(data)
      }
    } catch (error) {
      console.error('Failed to fetch lists:', error)
    }
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
        return true
      }
    } catch (error) {
      console.error('Login failed:', error)
    }
    return false
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })
      if (response.ok) {
        return await login(email, password)
      }
    } catch (error) {
      console.error('Registration failed:', error)
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setLists([])
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  const addList = async (name: string, emoji: string) => {
    const response = await fetchApi('/lists', {
      method: 'POST',
      body: JSON.stringify({ name, emoji }),
    })
    if (response.ok) await refreshLists()
  }

  const deleteList = async (id: string) => {
    const response = await fetchApi(`/lists/${id}`, {
      method: 'DELETE',
    })
    if (response.ok) await refreshLists()
  }

  const addProduct = async (listId: string, product: Omit<Product, 'id'>) => {
    const response = await fetchApi(`/lists/${listId}/products`, {
      method: 'POST',
      body: JSON.stringify(product),
    })
    if (response.ok) await refreshLists()
  }

  const updateProduct = async (listId: string, productId: string, updates: Partial<Product>) => {
    // We fetch the current product to make sure we don't overwrite with partial data 
    // if the backend expects a full object, or adjust backend to handle partial.
    // Our backend currently replaces the whole object in the service.
    const list = lists.find(l => l.id.toString() === listId)
    const currentProduct = list?.products?.find(p => p.id.toString() === productId)
    if (!currentProduct) return

    const response = await fetchApi(`/lists/${listId}/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ ...currentProduct, ...updates }),
    })
    if (response.ok) await refreshLists()
  }

  const deleteProduct = async (listId: string, productId: string) => {
    const response = await fetchApi(`/lists/${listId}/products/${productId}`, {
      method: 'DELETE',
    })
    if (response.ok) await refreshLists()
  }

  const toggleProduct = async (listId: string, productId: string) => {
    const list = lists.find(l => l.id.toString() === listId)
    const product = list?.products?.find(p => p.id.toString() === productId)
    if (product) {
      await updateProduct(listId, productId, { purchased: !product.purchased })
    }
  }

  if (!isHydrated) return null

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        lists,
        refreshLists,
        addList,
        deleteList,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

