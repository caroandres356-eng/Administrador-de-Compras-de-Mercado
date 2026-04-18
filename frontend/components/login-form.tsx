'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Mail, Lock, Eye, EyeOff, User } from 'lucide-react'

import { useApp } from '@/lib/app-context'

interface LoginFormProps {
  onSuccess: () => void
}

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
      const success = isLogin 
        ? await login(email, password)
        : await register(email, password, name)
        
      if (success) {
        onSuccess()
      } else {
        setError(isLogin ? 'Credenciales inválidas' : 'Error al registrar usuario')
      }
    } catch (err) {
      setError('Error de conexión con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto relative z-10"
    >
      <form onSubmit={handleSubmit} className="form pb-8">
        <p id="heading" className="flex items-center justify-center gap-2">
          <ShoppingCart stroke="white" />
          MercaList
        </p>

        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`text-sm px-4 py-1 rounded-full transition-all ${isLogin ? 'bg-primary text-white' : 'text-muted-foreground hover:text-white'}`}
          >
            Ingresar
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`text-sm px-4 py-1 rounded-full transition-all ${!isLogin ? 'bg-primary text-white' : 'text-muted-foreground hover:text-white'}`}
          >
            Registrarse
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!isLogin && (
            <motion.div
              key="name-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="field mb-4">
                <User className="input-icon" stroke="white" fill="none" />
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  required={!isLogin}
                  autoComplete="name"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="field">
            <Mail className="input-icon" stroke="white" fill="none" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
              autoComplete="email"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <div className="field">
            <Lock className="input-icon" stroke="white" fill="none" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="bg-transparent border-none p-0 cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
            >
              {showPassword ? <EyeOff className="input-icon" stroke="white" fill="none" /> : <Eye className="input-icon" stroke="white" fill="none" />}
            </button>
          </div>
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-xs text-center mt-4"
          >
            {error}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="btn mt-6"
        >
          <button
            type="submit"
            disabled={isLoading}
            className="button1 w-full text-center flex justify-center items-center"
          >
            <motion.span
              animate={isLoading ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              {isLoading 
                ? (isLogin ? 'Iniciando...' : 'Registrando...') 
                : (isLogin ? 'Iniciar sesión' : 'Crear cuenta')}
            </motion.span>
          </button>
        </motion.div>
      </form>
    </motion.div>
  )
}

