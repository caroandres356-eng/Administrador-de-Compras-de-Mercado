'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, ShoppingBag, Tag, Loader2, DollarSign, PieChart as PieIcon, BarChart3 } from 'lucide-react'
import {
  Bar, BarChart, Cell, Pie, PieChart,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts'
import { useEffect, useState } from 'react'
import { formatCOP } from '@/lib/mock-data'

interface StatsViewProps { onBack: () => void }

interface StatsData {
  monthlySpend: { month: string; amount: number }[]
  categorySpend: { category: string; amount: number }[]
  listSpend: { list: string; amount: number }[]
  totalLists: number
  totalProducts: number
  purchasedProducts: number
  pendingProducts: number
}

const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1']
const BAR_COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-xl px-4 py-3 shadow-xl border border-gray-100">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-bold text-gray-800" style={{ color: p.color }}>
          {p.name}: {formatCOP(p.value)}
        </p>
      ))}
    </div>
  )
}

export function StatsView({ onBack }: StatsViewProps) {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('mercalist-token')
        const response = await fetch('http://localhost:8080/api/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) setStats(await response.json())
      } catch (e) { console.error(e) }
      finally { setIsLoading(false) }
    }
    fetchStats()
  }, [])

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center" >
      <div className="text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Loader2 className="w-10 h-10 text-emerald-500 mx-auto" />
        </motion.div>
        <p className="text-gray-400 mt-3 text-sm">Cargando estadísticas...</p>
      </div>
    </div>
  )

  if (!stats) return null

  const monthlySpendData = stats.monthlySpend || []
  const categorySpendData = stats.categorySpend || []
  const listSpendData = stats.listSpend || []
  const totalMonthlySpend = monthlySpendData[monthlySpendData.length - 1]?.amount || 0
  const topCategory = categorySpendData.length > 0
    ? categorySpendData.reduce((max, cat) => cat.amount > max.amount ? cat : max)
    : { category: 'N/A', amount: 0 }
  const purchaseRate = stats.totalProducts > 0
    ? Math.round((stats.purchasedProducts / stats.totalProducts) * 100)
    : 0

  return (
    <div className="min-h-screen" >
      {/* Hero header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 35%, #15803d 65%, #059669 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-[0.06]" style={{ background: 'white' }} />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full opacity-[0.04]" style={{ background: 'white' }} />
          <div className="absolute top-0 left-1/4 w-px h-full bg-white/[0.03]" />
          <div className="absolute top-0 left-2/4 w-px h-full bg-white/[0.03]" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-white/[0.03]" />
          {/* Gráficos fantasma */}
          <motion.div className="absolute right-[8%] top-[15%] opacity-[0.06]"
            animate={{ y: [0, -8, 0] }} transition={{ duration: 7, repeat: Infinity }}>
            <BarChart3 width={100} height={60} stroke="white" strokeWidth={1.5} />
          </motion.div>
          <motion.div className="absolute right-[25%] bottom-[15%] opacity-[0.05]"
            animate={{ rotate: [0, 10, 0] }} transition={{ duration: 9, repeat: Infinity }}>
            <PieIcon width={80} height={80} stroke="white" strokeWidth={1.5} />
          </motion.div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-6 pb-20">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors border border-white/10">
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <div>
              <h1 className="font-black text-white text-2xl tracking-tight">Estadísticas</h1>
              <p className="text-green-200/70 text-xs">Resumen de tus compras</p>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 md:h-16" fill="#f8faf8">
            <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10 pb-10 space-y-5 relative z-10">
        {/* Stat cards con más estilo */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { title: 'Gasto del mes', value: formatCOP(totalMonthlySpend), icon: DollarSign, gradient: 'from-emerald-500 to-green-400', text: 'text-emerald-600', glow: 'shadow-emerald-100' },
            { title: 'Categoría top', value: topCategory.category, icon: Tag, gradient: 'from-amber-500 to-orange-400', text: 'text-amber-600', glow: 'shadow-amber-100' },
            { title: 'Listas totales', value: String(stats.totalLists), icon: ShoppingBag, gradient: 'from-violet-500 to-purple-400', text: 'text-violet-600', glow: 'shadow-violet-100' },
          ].map((card, i) => (
            <motion.div key={card.title}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`bg-white rounded-2xl p-5 shadow-xl border border-gray-100 ${card.glow}`}>
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-3 shadow-lg`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">{card.title}</p>
              <p className={`font-black text-base leading-tight ${card.text} truncate`}>{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Progreso general — con fondo sutil */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-800">Progreso general</h3>
                <p className="text-xs text-gray-400 mt-0.5">Productos comprados vs pendientes</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black" style={{ background: 'linear-gradient(135deg, #059669, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{purchaseRate}%</span>
              </div>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${purchaseRate}%` }}
                transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #059669, #10b981, #34d399)' }} />
            </div>
            <div className="flex justify-between mt-3 text-xs text-gray-400">
              <span>{stats.purchasedProducts} comprados</span>
              <span>{stats.pendingProducts} pendientes</span>
            </div>
          </div>
          <div className="bg-gray-50/80 border-t border-gray-100 px-5 py-4">
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Listas', value: stats.totalLists, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                { label: 'Productos', value: stats.totalProducts, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
                { label: 'Comprados', value: stats.purchasedProducts, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
                { label: 'Pendientes', value: stats.pendingProducts, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} ${s.border} border rounded-xl p-3 text-center`}>
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Histórico de gastos */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-gray-800">Histórico de gastos</h3>
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-orange-500" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-5">Gasto mensual acumulado</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySpendData} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" name="Gasto" radius={[8, 8, 0, 0]} maxBarSize={50}>
                  {monthlySpendData.map((_, index) => (
                    <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Gastos por categoría */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-gray-800">Gastos por categoría</h3>
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <PieIcon className="w-4 h-4 text-violet-500" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-5">Distribución de tus compras</p>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-56 w-56 shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categorySpendData} dataKey="amount" nameKey="category"
                    cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} strokeWidth={0}>
                    {categorySpendData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Centro del donut */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="font-black text-gray-800 text-sm">{formatCOP(categorySpendData.reduce((s, c) => s + c.amount, 0))}</p>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full space-y-3">
              {categorySpendData.map((cat, index) => {
                const total = categorySpendData.reduce((s, c) => s + c.amount, 0)
                const pct = total > 0 ? Math.round((cat.amount / total) * 100) : 0
                return (
                  <motion.div key={cat.category}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.08 }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-md shadow-sm" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                        <span className="text-sm font-medium text-gray-700 capitalize">{cat.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">{pct}%</span>
                        <span className="text-sm font-bold text-gray-800">{formatCOP(cat.amount)}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                        className="h-full rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Gasto por lista */}
        {listSpendData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-gray-800">Gasto por lista</h3>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-5">Comparación entre listas</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={listSpendData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${v/1000}k`} />
                  <YAxis type="category" dataKey="list" axisLine={false} tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }} width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" name="Gasto" radius={[0, 8, 8, 0]} maxBarSize={35}>
                    {listSpendData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
