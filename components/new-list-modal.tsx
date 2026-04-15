'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface NewListModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, emoji: string) => void
}

const emojis = ['🛒', '🥬', '🧹', '🏠', '🎉', '💊', '🐕', '📚']

export function NewListModal({ isOpen, onClose, onSubmit }: NewListModalProps) {
  const [name, setName] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('🛒')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim(), selectedEmoji)
      setName('')
      setSelectedEmoji('🛒')
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-md"
          >
            <div className="bg-card rounded-2xl shadow-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Nueva lista</h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nombre de la lista
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Mercado semanal"
                    className="h-12 rounded-xl"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Icono
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {emojis.map((emoji) => (
                      <motion.button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        whileTap={{ scale: 0.9 }}
                        className={`w-12 h-12 rounded-xl text-xl flex items-center justify-center transition-colors ${
                          selectedEmoji === emoji
                            ? 'bg-primary/10 ring-2 ring-primary'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!name.trim()}
                  className="w-full h-12 rounded-xl text-base font-medium"
                >
                  Crear lista
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
