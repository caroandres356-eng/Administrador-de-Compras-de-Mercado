'use client'

import { motion } from 'framer-motion'
import { ChevronRight, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type ShoppingList, formatCOP } from '@/lib/mock-data'

interface ListCardProps {
  list: ShoppingList
  index: number
  onSelect: () => void
  onDelete: () => void
}

export function ListCard({ list, index, onSelect, onDelete }: ListCardProps) {
  const purchasedCount = list.products.filter((p) => p.purchased).length
  const totalCount = list.products.length
  const progress = totalCount > 0 ? (purchasedCount / totalCount) * 100 : 0
  const totalSpend = list.products.reduce((sum, p) => sum + p.price, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{list.emoji}</span>
            <h3 className="font-semibold text-foreground">{list.name}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-muted-foreground hover:text-destructive h-8 w-8"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium text-foreground">
                {purchasedCount}/{totalCount} productos
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs text-muted-foreground">Total estimado</p>
              <p className="font-semibold text-foreground">{formatCOP(totalSpend)}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Actualizado: {new Date(list.updatedAt).toLocaleDateString('es-CO')}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onSelect}
        className="w-full px-5 py-3 bg-muted/50 hover:bg-muted transition-colors flex items-center justify-between group/btn"
      >
        <span className="text-sm font-medium text-primary">Ver lista</span>
        <ChevronRight className="w-4 h-4 text-primary group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  )
}
