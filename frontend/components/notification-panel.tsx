'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Plus, X, Trash2, Check, Calendar } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { type Reminder, formatReminderDate, getReminderStatus } from '@/lib/mock-data'

export function NotificationPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { reminders, addReminder, deleteReminder, markReminderRead } = useApp()
  const [isCreating, setIsCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [description, setDescription] = useState('')

  const handleCreate = async () => {
    if (!title.trim() || !dueDate) return
    await addReminder({ title: title.trim(), description: description.trim(), dueDate })
    setTitle('')
    setDueDate('')
    setDescription('')
    setIsCreating(false)
  }

  const statusStyles = {
    past: { dot: 'bg-red-400', text: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
    today: { dot: 'bg-amber-400', text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    future: { dot: 'bg-emerald-400', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  }

  const statusLabels = { past: 'Vencido', today: 'Hoy', future: 'Próximo' }

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
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-gray-800 text-sm">Recordatorios</span>
                <span className="text-xs text-gray-400">({reminders.length})</span>
              </div>
              <div className="flex items-center gap-1">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsCreating(!isCreating)}
                  className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-emerald-600 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </motion.button>
                <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-200 flex items-center justify-center text-gray-400 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* New reminder form */}
            <AnimatePresence>
              {isCreating && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-b border-gray-100">
                  <div className="p-3 space-y-2 bg-gray-50/50">
                    <input type="text" placeholder="Título del recordatorio" value={title} onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" autoFocus />
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                    <input type="text" placeholder="Descripción (opcional)" value={description} onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                    <button onClick={handleCreate} disabled={!title.trim() || !dueDate}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors">
                      Crear recordatorio
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* List */}
            <div className="max-h-72 overflow-y-auto">
              {reminders.length === 0 ? (
                <div className="py-10 text-center">
                  <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Sin recordatorios</p>
                  <p className="text-gray-300 text-xs mt-0.5">Crea uno para empezar</p>
                </div>
              ) : (
                reminders.map((r: Reminder) => {
                  const status = getReminderStatus(r.dueDate)
                  const style = statusStyles[status]
                  return (
                    <motion.div key={r.id}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50/50 transition-colors group ${!r.read ? 'bg-emerald-50/30' : ''}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                          {!r.read && <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />}
                          <div className="min-w-0">
                            <p className={`text-sm font-medium ${r.read ? 'text-gray-400' : 'text-gray-800'} truncate`}>{r.title}</p>
                            {r.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{r.description}</p>}
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${style.bg} ${style.text} ${style.border} border`}>
                                <span className={`w-1 h-1 rounded-full ${style.dot}`} />
                                {statusLabels[status]}
                              </span>
                              <span className="text-[11px] text-gray-400">{formatReminderDate(r.dueDate)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          {!r.read && (
                            <motion.button whileTap={{ scale: 0.9 }} onClick={() => markReminderRead(r.id)}
                              className="w-6 h-6 rounded-md hover:bg-emerald-100 flex items-center justify-center text-emerald-500 transition-colors">
                              <Check className="w-3 h-3" />
                            </motion.button>
                          )}
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => deleteReminder(r.id)}
                            className="w-6 h-6 rounded-md hover:bg-red-50 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
