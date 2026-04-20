'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Pencil, Trash2, X, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type Product, type Category, categoryConfig, formatCOP } from '@/lib/mock-data'
import { useApp } from '@/lib/app-context'

interface ProductRowProps {
  product: Product
  index: number
  listId: string
  onToggle: () => void
  onDelete: () => void
}

export function ProductRow({ product, index, listId, onToggle, onDelete }: ProductRowProps) {
  const { updateProduct } = useApp()
  const category = categoryConfig[product.category] ?? { color: 'bg-gray-100 text-gray-700', emoji: '📦', label: 'Otro' }

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(product.name)
  const [quantity, setQuantity] = useState(String(product.quantity))
  const [unit, setUnit] = useState(product.unit || '')
  const [price, setPrice] = useState(String(product.price))
  const [selectedCategory, setSelectedCategory] = useState<Category>(product.category)
  const [quantityError, setQuantityError] = useState('')
  const [priceError, setPriceError] = useState('')

  const handleQuantityChange = (val: string) => {
    setQuantity(val)
    if (val && isNaN(Number(val))) {
      setQuantityError('⚠️ Solo se permiten valores numéricos')
    } else {
      setQuantityError('')
    }
  }

  const handlePriceChange = (val: string) => {
    setPrice(val)
    if (val && isNaN(Number(val))) {
      setPriceError('⚠️ Solo se permiten valores numéricos')
    } else {
      setPriceError('')
    }
  }

  const handleSave = async () => {
    if (!name.trim() || quantityError || priceError) return
    await updateProduct(listId, product.id.toString(), {
      name: name.trim(),
      quantity: parseFloat(quantity) || product.quantity,
      unit: unit || product.unit,
      price: parseFloat(price) || product.price,
      category: selectedCategory,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setName(product.name)
    setQuantity(String(product.quantity))
    setUnit(product.unit || '')
    setPrice(String(product.price))
    setSelectedCategory(product.category)
    setQuantityError('')
    setPriceError('')
    setIsEditing(false)
  }

  const categories = Object.entries(categoryConfig) as [Category, typeof categoryConfig.comida][]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05 }}
      layout
      className={`bg-card rounded-xl border border-border group transition-shadow hover:shadow-sm ${
        product.purchased && !isEditing ? 'opacity-60' : ''
      }`}
    >
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-4 p-4"
          >
            <motion.button
              onClick={onToggle}
              whileTap={{ scale: 0.9 }}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                product.purchased
                  ? 'bg-primary border-primary'
                  : 'border-muted-foreground/30 hover:border-primary'
              }`}
            >
              <motion.div
                initial={false}
                animate={{ scale: product.purchased ? 1 : 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Check className="w-4 h-4 text-primary-foreground" />
              </motion.div>
            </motion.button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`font-medium text-foreground transition-all ${
                    product.purchased ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {product.name}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${category.color}`}>
                  {category.emoji} {category.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{product.quantity} {product.unit}</span>
                <span className="font-medium text-foreground">{formatCOP(product.price)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 space-y-3"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-foreground">Editar producto</p>
              <Button variant="ghost" size="icon" onClick={handleCancel} className="h-7 w-7 rounded-lg">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Nombre */}
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del producto"
              className="h-9 rounded-lg"
            />

            {/* Cantidad + Unidad */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  placeholder="Cantidad"
                  className={`h-9 rounded-lg ${quantityError ? 'border-destructive' : ''}`}
                />
                {quantityError && (
                  <p className="text-xs text-destructive mt-1">{quantityError}</p>
                )}
              </div>
              <Input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Unidad (kg, L, und)"
                className="h-9 rounded-lg"
              />
            </div>

            {/* Precio */}
            <div>
              <Input
                value={price}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="Precio (COP)"
                className={`h-9 rounded-lg ${priceError ? 'border-destructive' : ''}`}
              />
              {priceError && (
                <p className="text-xs text-destructive mt-1">{priceError}</p>
              )}
            </div>

            {/* Categoría */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedCategory(key)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                    selectedCategory === key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {config.emoji} {config.label}
                </button>
              ))}
            </div>

            <Button
              onClick={handleSave}
              disabled={!name.trim() || !!quantityError || !!priceError}
              className="w-full h-9 rounded-lg"
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar cambios
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
