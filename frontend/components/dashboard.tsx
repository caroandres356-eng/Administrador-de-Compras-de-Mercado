'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, ShoppingBag, CheckCircle2, TrendingUp, Sparkles, ShoppingCart } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { Navbar } from './navbar'
import { ListCard } from './list-card'
import { NewListModal } from './new-list-modal'
import { formatCOP } from '@/lib/mock-data'

interface DashboardProps {
  onListSelect: (listId: string) => void
  onLogout: () => void
  onStatsClick: () => void
}

const heroItems = [
  { emoji: '🍎', top: '10%', right: '8%',  delay: 0,   size: 44 },
  { emoji: '🥦', top: '22%', right: '28%', delay: 0.7, size: 36 },
  { emoji: '🥕', top: '8%',  right: '42%', delay: 1.2, size: 30 },
  { emoji: '🍊', top: '45%', right: '12%', delay: 0.4, size: 40 },
  { emoji: '🫑', top: '55%', right: '35%', delay: 1.8, size: 28 },
  { emoji: '🥝', top: '30%', right: '55%', delay: 0.9, size: 32 },
  { emoji: '🍋', top: '65%', right: '22%', delay: 1.5, size: 34 },
  { emoji: '🍇', top: '15%', right: '65%', delay: 2.1, size: 30 },
  { emoji: '🛒', top: '50%', right: '60%', delay: 0.3, size: 38 },
]

export function Dashboard({ onListSelect, onLogout, onStatsClick }: DashboardProps) {
  const { user, lists, addList, deleteList } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const totalProducts = lists.reduce((s, l) => s + (l.products?.length || 0), 0)
  const totalPurchased = lists.reduce((s, l) => s + (l.products?.filter(p => p.purchased).length || 0), 0)
  const totalSpend = lists.reduce((s, l) => s + (l.products?.reduce((ps, p) => ps + p.price, 0) || 0), 0)

  const stats = [
    { icon: ShoppingBag,  label: 'Listas activas', value: String(lists.length),                gradient: 'from-emerald-500 to-green-400',  text: 'text-emerald-600' },
    { icon: CheckCircle2, label: 'Comprados',       value: `${totalPurchased}/${totalProducts}`, gradient: 'from-sky-500 to-cyan-400',       text: 'text-sky-600'     },
    { icon: TrendingUp,   label: 'Total estimado',  value: formatCOP(totalSpend),               gradient: 'from-orange-500 to-amber-400',   text: 'text-orange-600'  },
  ]

  return (
    <div className="min-h-screen" >
      <Navbar onLogout={onLogout} onStatsClick={onStatsClick} />

      {/* HERO */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 35%, #15803d 65%, #059669 100%)' }}>
        {/* Capas de fondo */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Círculos grandes */}
          <motion.div className="absolute -right-20 -top-20 w-80 h-80 rounded-full opacity-[0.06]" style={{ background: 'white' }}
            animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }} />
          <motion.div className="absolute right-16 top-4 w-48 h-48 rounded-full opacity-[0.05]" style={{ background: 'white' }}
            animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }} />
          <motion.div className="absolute -left-12 bottom-0 w-64 h-64 rounded-full opacity-[0.04]" style={{ background: 'white' }}
            animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} />
          {/* Líneas verticales sutiles */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-white/[0.03]" />
          <div className="absolute top-0 left-2/4 w-px h-full bg-white/[0.03]" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-white/[0.03]" />
          {/* Carrito fantasma grande */}
          <motion.div className="absolute right-[5%] bottom-[10%] opacity-[0.06]"
            animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }} transition={{ duration: 6, repeat: Infinity }}>
            <ShoppingCart width={120} height={120} stroke="white" strokeWidth={1} />
          </motion.div>
        </div>

        {/* Frutas y verduras flotantes */}
        {heroItems.map(({ emoji, top, right, delay, size }, i) => (
          <motion.div key={i} className="absolute pointer-events-none" style={{ top, right }}
            animate={{ y: [0, -12, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4 + i * 0.4, repeat: Infinity, delay, ease: 'easeInOut' }}>
            <span style={{ fontSize: size }} className="opacity-25 drop-shadow-lg">{emoji}</span>
          </motion.div>
        ))}

        {/* Contenido del hero */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-10 pb-24">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <p className="text-green-200/80 text-sm capitalize">{today}</p>
            </div>
            <h1 className="text-4xl font-black text-white mb-1 tracking-tight">
              ¡Hola, {user?.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-green-200/80 text-base">Aquí están tus listas de compras</p>
          </motion.div>
        </div>

        {/* Curva SVG */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 md:h-16" fill="#f8faf8">
            <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-10 pb-10 relative z-10">
        {/* Stats cards */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-10">
          {stats.map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-md`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">{stat.label}</p>
              <p className={`font-black text-lg leading-tight ${stat.text}`}>{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Section header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-black text-gray-800 text-2xl tracking-tight">Mis listas</h2>
            <p className="text-gray-400 text-sm mt-0.5">{lists.length} listas activas</p>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg shadow-green-200 transition-all"
            style={{ background: 'linear-gradient(135deg, #16a34a, #059669)' }}>
            <Plus className="w-4 h-4" />
            Nueva lista
          </motion.button>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {lists.map((list, index) => (
            <ListCard key={list.id} list={list} index={index}
              onSelect={() => onListSelect(list.id)} onDelete={() => deleteList(list.id)} />
          ))}
        </div>

        {lists.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'linear-gradient(135deg, #dcfce7, #d1fae5)' }}>
              <ShoppingBag className="w-9 h-9 text-green-400" />
            </div>
            <h3 className="text-xl font-black text-gray-700 mb-2">No tienes listas aún</h3>
            <p className="text-gray-400 mb-6">Crea tu primera lista para comenzar</p>
            <button onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-xl text-white font-semibold shadow-lg shadow-green-200"
              style={{ background: 'linear-gradient(135deg, #16a34a, #059669)' }}>
              <Plus className="w-4 h-4 inline mr-2" />Crear lista
            </button>
          </motion.div>
        )}
      </div>

      {/* FAB */}
      <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-2xl shadow-green-300 z-50"
        style={{ background: 'linear-gradient(135deg, #16a34a, #059669)' }}>
        <Plus className="w-6 h-6" />
      </motion.button>

      <NewListModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={addList} />
    </div>
  )
}
