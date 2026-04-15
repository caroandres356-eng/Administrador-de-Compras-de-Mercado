'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type Category, type Product, categoryConfig } from '@/lib/mock-data'

interface AddProductFormProps {
  onAdd: (product: Omit<Product, 'id'>) => void
}

export function AddProductForm({ onAdd }: AddProductFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState<Category>('comida')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && quantity && price) {
      onAdd({
        name: name.trim(),
        quantity: parseFloat(quantity),
        unit: unit || 'und',
        price: parseFloat(price),
        category,
        purchased: false,
      })
      setName('')
      setQuantity('')
      setUnit('')
      setPrice('')
      setCategory('comida')
      setIsOpen(false)
    }
  }

  const categories = Object.entries(categoryConfig) as [Category, typeof categoryConfig.comida][]

  return (
    <div className="mt-4">
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              variant="outline"
              className="w-full h-12 rounded-xl border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar producto
            </Button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-card rounded-xl border border-border p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-foreground">Nuevo producto</h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre del producto"
                  className="h-10 rounded-lg"
                  autoFocus
                />
              </div>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Cantidad"
                className="h-10 rounded-lg"
                min="0"
                step="0.1"
              />
              <Input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Unidad (kg, L, und)"
                className="h-10 rounded-lg"
              />
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Precio (COP)"
                className="h-10 rounded-lg col-span-2"
                min="0"
              />
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Categoria</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(([key, config]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCategory(key)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      category === key
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {config.emoji} {config.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={!name.trim() || !quantity || !price}
              className="w-full h-10 rounded-lg"
            >
              Agregar
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
