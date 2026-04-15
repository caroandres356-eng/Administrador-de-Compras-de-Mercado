'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { initialShoppingLists, mockUser, type ShoppingList, type User, type Product } from './mock-data'

interface AppContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
  lists: ShoppingList[]
  addList: (name: string, emoji: string) => void
  deleteList: (id: string) => void
  addProduct: (listId: string, product: Omit<Product, 'id'>) => void
  updateProduct: (listId: string, productId: string, updates: Partial<Product>) => void
  deleteProduct: (listId: string, productId: string) => void
  toggleProduct: (listId: string, productId: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const STORAGE_KEY = 'mercalist-data'
const AUTH_KEY = 'mercalist-auth'

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_KEY)
    if (savedAuth === 'true') {
      setUser(mockUser)
    }

    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      setLists(JSON.parse(savedData))
    } else {
      setLists(initialShoppingLists)
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
    }
  }, [lists, isHydrated])

  const login = (email: string, password: string): boolean => {
    if (email && password) {
      setUser(mockUser)
      localStorage.setItem(AUTH_KEY, 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(AUTH_KEY)
  }

  const addList = (name: string, emoji: string) => {
    const newList: ShoppingList = {
      id: Date.now().toString(),
      name,
      emoji,
      products: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    }
    setLists((prev) => [...prev, newList])
  }

  const deleteList = (id: string) => {
    setLists((prev) => prev.filter((list) => list.id !== id))
  }

  const addProduct = (listId: string, product: Omit<Product, 'id'>) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            products: [...list.products, { ...product, id: Date.now().toString() }],
            updatedAt: new Date().toISOString().split('T')[0],
          }
        }
        return list
      })
    )
  }

  const updateProduct = (listId: string, productId: string, updates: Partial<Product>) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            products: list.products.map((p) => (p.id === productId ? { ...p, ...updates } : p)),
            updatedAt: new Date().toISOString().split('T')[0],
          }
        }
        return list
      })
    )
  }

  const deleteProduct = (listId: string, productId: string) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            products: list.products.filter((p) => p.id !== productId),
            updatedAt: new Date().toISOString().split('T')[0],
          }
        }
        return list
      })
    )
  }

  const toggleProduct = (listId: string, productId: string) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            products: list.products.map((p) => (p.id === productId ? { ...p, purchased: !p.purchased } : p)),
            updatedAt: new Date().toISOString().split('T')[0],
          }
        }
        return list
      })
    )
  }

  if (!isHydrated) {
    return null
  }

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        lists,
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
