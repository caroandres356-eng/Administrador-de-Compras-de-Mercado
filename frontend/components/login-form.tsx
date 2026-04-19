'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react'
import { useApp } from '@/lib/app-context'

interface LoginFormProps { onSuccess: () => void }

const categoryItems = [
  { emoji: '🥘', label: 'Comida',     x: '12%', y: '15%' },
  { emoji: '🧹', label: 'Aseo',       x: '72%', y: '10%' },
  { emoji: '🚌', label: 'Transporte', x: '8%',  y: '58%' },
  { emoji: '🏠', label: 'Hogar',      x: '68%', y: '52%' },
  { emoji: '📦', label: 'Otros',      x: '40%', y: '75%' },
]

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login, register } = useApp()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const success = isLogin ? await login(email, password) : await register(email, password, name)
      if (success) onSuccess()
      else setError(isLogin ? 'Credenciales inválidas' : 'Error al registrar usuario')
    } catch { setError('Error de conexión con el servidor') }
    finally { setIsLoading(false) }
  }

  return (
    <div className="w-full min-h-screen flex">
      {/* ===== PANEL IZQUIERDO — Branding de la app ===== */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #14532d 0%, #166534 30%, #15803d 65%, #059669 100%)' }}>

        {/* Textura de fondo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.06]" style={{ background: 'white' }} />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-[0.06]" style={{ background: 'white' }} />
          <div className="absolute top-0 left-1/4 w-px h-full bg-white/[0.03]" />
          <div className="absolute top-0 left-2/4 w-px h-full bg-white/[0.03]" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-white/[0.03]" />
          {/* Patrones de puntos sutiles */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        {/* Categorías flotando — representan lo que la app maneja */}
        {categoryItems.map(({ emoji, label, x, y }, i) => (
          <motion.div key={label} className="absolute pointer-events-none" style={{ left: x, top: y }}
            animate={{ y: [0, -10, 0], rotate: [0, 6, -6, 0] }}
            transition={{ duration: 5 + i * 0.6, repeat: Infinity, delay: i * 0.7, ease: 'easeInOut' }}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10 shadow-lg">
                <span className="text-2xl">{emoji}</span>
              </div>
              <span className="text-white/30 text-[10px] font-medium">{label}</span>
            </div>
          </motion.div>
        ))}

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-black text-xl leading-none">MercaList</span>
            <p className="text-green-300/70 text-xs leading-none mt-0.5">Tu mercado organizado</p>
          </div>
        </div>

        {/* Contenido central — solo branding, sin datos falsos */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-200/70 text-xs font-medium">5 categorías · Listas ilimitadas</span>
            </div>
            <h2 className="text-5xl font-black text-white mb-4 leading-[1.1] tracking-tight">
              Tu mercado,<br />
              <span className="text-green-300/90">sin complicaciones</span>
            </h2>
            <p className="text-green-200/60 text-base leading-relaxed max-w-xs">
              Organiza todo lo que compras — comida, aseo, transporte, hogar — en un solo lugar.
            </p>
          </motion.div>
        </div>

        {/* Footer mínimo */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-2">
            {['🥘', '🧹', '🚌', '🏠', '📦'].map((e, i) => (
              <div key={i} className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-sm">{e}</div>
            ))}
          </div>
          <p className="text-green-300/40 text-xs">Comida · Aseo · Transporte · Hogar · Otros</p>
        </div>
      </div>

      {/* ===== PANEL DERECHO — Formulario con fondo gris texturizado ===== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-hidden"
        style={{ background: '#f5f5f5' }}>

        {/* Textura sutil de fondo */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.35]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.5" fill="#d4d4d4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          {/* Gradientes sutiles en las esquinas */}
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-[0.15]" style={{ background: 'radial-gradient(circle, #e5e5e5, transparent 70%)' }} />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-[0.15]" style={{ background: 'radial-gradient(circle, #e5e5e5, transparent 70%)' }} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} className="w-full max-w-md relative z-10">

          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #166534, #059669)' }}>
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-gray-800 text-lg">MercaList</span>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-1">
            {isLogin ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
          </h1>
          <p className="text-gray-400 mb-8 text-sm">
            {isLogin ? 'Ingresa tus datos para continuar' : 'Empieza a organizar tus compras hoy'}
          </p>

          {/* Tabs */}
          <div className="flex bg-gray-200/60 rounded-xl p-1 mb-6">
            {['Ingresar', 'Registrarse'].map((tab, i) => (
              <button key={tab} type="button"
                onClick={() => { setIsLogin(i === 0); setError(null) }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  (i === 0) === isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >{tab}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {!isLogin && (
                <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre completo</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Tu nombre" value={name}
                      onChange={(e) => setName(e.target.value)} required={!isLogin}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm shadow-sm" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm shadow-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password}
                  onChange={(e) => setPassword(e.target.value)} required
                  className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm shadow-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-500 shadow-sm">{error}</motion.div>
              )}
            </AnimatePresence>

            <motion.button type="submit" disabled={isLoading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="w-full py-3.5 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 text-sm mt-2"
              style={{ background: 'linear-gradient(135deg, #16a34a, #059669)', boxShadow: '0 8px 24px -4px rgba(22, 163, 74, 0.35)' }}>
              {isLoading ? (
                <motion.div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
              ) : (
                <>{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}<ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
