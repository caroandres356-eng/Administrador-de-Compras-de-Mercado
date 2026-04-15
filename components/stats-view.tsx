'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, ShoppingBag, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { useApp } from '@/lib/app-context'
import { monthlySpendData, categorySpendData, formatCOP, categoryConfig } from '@/lib/mock-data'

interface StatsViewProps {
  onBack: () => void
}

export function StatsView({ onBack }: StatsViewProps) {
  const { lists } = useApp()

  const totalMonthlySpend = monthlySpendData[monthlySpendData.length - 1]?.amount || 0
  const topCategory = categorySpendData.reduce((max, cat) =>
    cat.amount > max.amount ? cat : max
  )
  
  const allProducts = lists.flatMap((l) => l.products)
  const productCounts = allProducts.reduce((acc, p) => {
    acc[p.name] = (acc[p.name] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const topProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]

  const pieColors = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280']

  const statCards = [
    {
      title: 'Gasto del mes',
      value: formatCOP(totalMonthlySpend),
      icon: TrendingUp,
      color: 'bg-emerald-500',
    },
    {
      title: 'Categoria top',
      value: topCategory.category,
      icon: Tag,
      color: 'bg-amber-500',
    },
    {
      title: 'Producto frecuente',
      value: topProduct?.[0] || 'N/A',
      icon: ShoppingBag,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg text-foreground">Estadisticas</h1>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl border border-border p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
              </div>
              <p className="text-xl font-bold text-foreground truncate">{card.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl border border-border p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Gastos mensuales</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySpendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip
                  formatter={(value: number) => [formatCOP(value), 'Gasto']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]} fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl border border-border p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Gastos por categoria</h3>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-64 w-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySpendData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                  >
                    {categorySpendData.map((entry, index) => (
                      <Cell key={entry.category} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [formatCOP(value), 'Gasto']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {categorySpendData.map((cat, index) => (
                <div key={cat.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: pieColors[index % pieColors.length] }}
                    />
                    <span className="text-sm text-foreground">{cat.category}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {formatCOP(cat.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl border border-border p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Resumen de listas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-xl">
              <p className="text-3xl font-bold text-foreground">{lists.length}</p>
              <p className="text-sm text-muted-foreground">Listas totales</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-xl">
              <p className="text-3xl font-bold text-foreground">{allProducts.length}</p>
              <p className="text-sm text-muted-foreground">Productos</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-xl">
              <p className="text-3xl font-bold text-primary">
                {allProducts.filter((p) => p.purchased).length}
              </p>
              <p className="text-sm text-muted-foreground">Comprados</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-xl">
              <p className="text-3xl font-bold text-foreground">
                {allProducts.filter((p) => !p.purchased).length}
              </p>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
