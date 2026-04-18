'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/app-context'
import { formatCOP } from '@/lib/mock-data'
import { ProductRow } from './product-row'
import { AddProductForm } from './add-product-form'

interface ListDetailProps {
  listId: string
  onBack: () => void
}

type FilterTab = 'all' | 'pending' | 'purchased'

export function ListDetail({ listId, onBack }: ListDetailProps) {
  const { lists, toggleProduct, deleteProduct, addProduct, updateProduct } = useApp()
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const list = lists.find((l) => l.id.toString() === listId.toString())

  if (!list) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Lista no encontrada</p>
      </div>
    )
  }

  const filteredProducts = (list.products || []).filter((product) => {
    if (activeTab === 'pending') return !product.purchased
    if (activeTab === 'purchased') return product.purchased
    return true
  })
  
  const totalItems = (list.products || []).length
  const purchasedItems = (list.products || []).filter((p) => p.purchased).length
  const pendingItems = totalItems - purchasedItems
  const totalSpend = (list.products || []).reduce((sum, p) => sum + p.price, 0)
  const purchasedSpend = (list.products || [])
    .filter((p) => p.purchased)
    .reduce((sum, p) => sum + p.price, 0)

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'Todos', count: totalItems },
    { key: 'pending', label: 'Pendientes', count: pendingItems },
    { key: 'purchased', label: 'Comprados', count: purchasedItems },
  ]

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{list.emoji}</span>
            <h1 className="font-bold text-lg text-foreground">{list.name}</h1>
          </div>
        </div>
      </motion.header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex gap-2 p-1 bg-muted rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-card rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {tab.label} ({tab.count})
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <ProductRow
                key={product.id}
                product={product}
                index={index}
                listId={listId.toString()}
                onToggle={() => toggleProduct(listId.toString(), product.id.toString())}
                onDelete={() => deleteProduct(listId.toString(), product.id.toString())}
              />
            ))}
          </AnimatePresence>

          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                {activeTab === 'pending'
                  ? 'No hay productos pendientes'
                  : activeTab === 'purchased'
                  ? 'No hay productos comprados'
                  : 'No hay productos en esta lista'}
              </p>
            </motion.div>
          )}
        </div>

        <AddProductForm onAdd={(product) => addProduct(listId.toString(), product)} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 bg-card rounded-xl border border-border"
        >
          <h3 className="font-semibold text-foreground mb-3">Resumen</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">{totalItems}</p>
              <p className="text-xs text-muted-foreground">Total productos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{purchasedItems}</p>
              <p className="text-xs text-muted-foreground">Comprados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingItems}</p>
              <p className="text-xs text-muted-foreground">Pendientes</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total estimado</p>
              <p className="text-xl font-bold text-foreground">{formatCOP(totalSpend)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Gastado</p>
              <p className="text-xl font-bold text-primary">{formatCOP(purchasedSpend)}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
