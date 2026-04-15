'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/app-context'
import { Navbar } from './navbar'
import { ListCard } from './list-card'
import { NewListModal } from './new-list-modal'

interface DashboardProps {
  onListSelect: (listId: string) => void
  onLogout: () => void
  onStatsClick: () => void
}

export function Dashboard({ onListSelect, onLogout, onStatsClick }: DashboardProps) {
  const { user, lists, addList, deleteList } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const activeLists = lists.filter((list) => {
    const pending = list.products.filter((p) => !p.purchased).length
    return pending > 0 || list.products.length === 0
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar onLogout={onLogout} onStatsClick={onStatsClick} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Hola, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground capitalize">{today}</p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
          >
            <span className="w-2 h-2 bg-primary rounded-full" />
            {activeLists.length} listas activas
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list, index) => (
            <ListCard
              key={list.id}
              list={list}
              index={index}
              onSelect={() => onListSelect(list.id)}
              onDelete={() => deleteList(list.id)}
            />
          ))}
        </div>

        {lists.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🛒</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No tienes listas aún
            </h3>
            <p className="text-muted-foreground mb-6">
              Crea tu primera lista de compras para comenzar
            </p>
            <Button onClick={() => setIsModalOpen(true)} className="rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Crear lista
            </Button>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        className="fixed bottom-6 right-6"
      >
        <Button
          onClick={() => setIsModalOpen(true)}
          size="lg"
          className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>

      <NewListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addList}
      />
    </div>
  )
}
