'use client'

import { motion } from 'framer-motion'
import { ChevronRight, Trash2, Package, CheckCircle } from 'lucide-react'
import { type ShoppingList, formatCOP } from '@/lib/mock-data'

interface ListCardProps {
  list: ShoppingList
  index: number
  onSelect: () => void
  onDelete: () => void
}

const cardAccents = [
  { border: 'border-l-emerald-400', icon: 'bg-emerald-50 text-emerald-600', progress: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-700' },
  { border: 'border-l-blue-400',    icon: 'bg-blue-50 text-blue-600',    progress: 'bg-blue-400',    badge: 'bg-blue-50 text-blue-700' },
  { border: 'border-l-orange-400',  icon: 'bg-orange-50 text-orange-600', progress: 'bg-orange-400', badge: 'bg-orange-50 text-orange-700' },
  { border: 'border-l-purple-400',  icon: 'bg-purple-50 text-purple-600', progress: 'bg-purple-400', badge: 'bg-purple-50 text-purple-700' },
  { border: 'border-l-rose-400',    icon: 'bg-rose-50 text-rose-600',    progress: 'bg-rose-400',    badge: 'bg-rose-50 text-rose-700' },
]

export function ListCard({ list, index, onSelect, onDelete }: ListCardProps) {
  const accent = cardAccents[index % cardAccents.length]
  const purchasedCount = (list.products || []).filter((p) => p.purchased).length
  const totalCount = (list.products || []).length
  const progress = totalCount > 0 ? (purchasedCount / totalCount) * 100 : 0
  const totalSpend = (list.products || []).reduce((sum, p) => sum + p.price, 0)
  const isComplete = totalCount > 0 && purchasedCount === totalCount

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${accent.border} shadow-sm hover:shadow-lg transition-all overflow-hidden group`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold ${accent.icon}`}>
              {list.emoji}
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{list.name}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <Package className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-400">{totalCount} productos</p>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-400">Progreso</span>
            {isComplete ? (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle className="w-3 h-3" /> Completada
              </span>
            ) : (
              <span className="text-gray-600 font-medium">{purchasedCount}/{totalCount}</span>
            )}
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ delay: index * 0.08 + 0.3, duration: 0.7, ease: 'easeOut' }}
              className={`h-full rounded-full ${accent.progress}`}
            />
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Total estimado</p>
            <p className="font-bold text-gray-800 text-lg">{formatCOP(totalSpend)}</p>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${accent.badge}`}>
            {Math.round(progress)}% listo
          </span>
        </div>
      </div>

      <button
        onClick={onSelect}
        className="w-full px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between border-t border-gray-100 group/btn"
      >
        <span className="text-sm font-semibold text-gray-600">Ver lista</span>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  )
}
