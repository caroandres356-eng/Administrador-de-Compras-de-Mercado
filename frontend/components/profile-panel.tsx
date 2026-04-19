'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, User, Mail } from 'lucide-react'
import { useApp } from '@/lib/app-context'

const avatarOptions = ['😊', '😎', '🤓', '👤', '🦊', '🐱', '🐶', '🦁', '🐼', '🐸', '👑', '⭐', '🔥', '💎', '🎯', '🛒']

export function ProfilePanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, updateProfile } = useApp()
  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState(user?.avatar || '😊')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) return
    setIsSaving(true)
    setSaved(false)
    await updateProfile(name.trim(), avatar)
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setTimeout(() => onClose(), 800)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <span className="font-semibold text-gray-800 text-sm">Mi perfil</span>
              <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-200 flex items-center justify-center text-gray-400 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Avatar grande */}
              <div className="flex justify-center">
                <motion.div whileHover={{ scale: 1.05 }} className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-green-200">
                  <span className="text-3xl">{avatar}</span>
                </motion.div>
              </div>

              {/* Email (solo lectura) */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mb-1">
                  <Mail className="w-3 h-3" /> Correo
                </label>
                <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-500 truncate">
                  {user?.email}
                </div>
              </div>

              {/* Nombre editable */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mb-1">
                  <User className="w-3 h-3" /> Nombre
                </label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>

              {/* Avatar picker */}
              <div>
                <label className="text-xs font-medium text-gray-400 mb-2 block">Avatar</label>
                <div className="grid grid-cols-8 gap-1.5">
                  {avatarOptions.map((opt) => (
                    <motion.button key={opt} type="button" whileTap={{ scale: 0.9 }}
                      onClick={() => setAvatar(opt)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all ${
                        avatar === opt
                          ? 'bg-emerald-100 ring-2 ring-emerald-500 scale-110'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}>
                      {opt}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Save */}
              <motion.button whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={!name.trim() || isSaving}
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  background: saved ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #16a34a, #059669)',
                  boxShadow: '0 4px 12px -2px rgba(22, 163, 74, 0.3)',
                }}>
                {isSaving ? (
                  <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }} />
                ) : saved ? (
                  <>✓ Guardado</>
                ) : (
                  <><Save className="w-3.5 h-3.5" /> Guardar cambios</>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
