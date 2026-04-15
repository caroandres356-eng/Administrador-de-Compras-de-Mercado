'use client'

import { motion } from 'framer-motion'
import { Check, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type Product, categoryConfig, formatCOP } from '@/lib/mock-data'

interface ProductRowProps {
  product: Product
  index: number
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ProductRow({ product, index, onToggle, onEdit, onDelete }: ProductRowProps) {
  const category = categoryConfig[product.category]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05 }}
      layout
      className={`flex items-center gap-4 p-4 bg-card rounded-xl border border-border group hover:shadow-sm transition-shadow ${
        product.purchased ? 'opacity-60' : ''
      }`}
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
          <span>
            {product.quantity} {product.unit}
          </span>
          <span className="font-medium text-foreground">{formatCOP(product.price)}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
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
  )
}
