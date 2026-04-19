'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, LogOut, BarChart3, Bell } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { NotificationPanel } from './notification-panel'
import { ProfilePanel } from './profile-panel'

interface NavbarProps {
  onLogout: () => void
  onStatsClick: () => void
}

export function Navbar({ onLogout, onStatsClick }: NavbarProps) {
  const { user, reminders } = useApp()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const unreadCount = reminders.filter(r => !r.isRead).length

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-green-200">
            <ShoppingCart className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-gray-800 text-base leading-none">MercaList</span>
            <p className="text-[10px] text-gray-400 leading-none">Tu mercado organizado</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Stats */}
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={onStatsClick}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all">
            <BarChart3 className="w-4 h-4" />
          </motion.button>

          {/* Bell */}
          <div className="relative">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false) }}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm"
                  style={{ minWidth: 18, height: 18 }}>
                  {unreadCount}
                </motion.span>
              )}
            </motion.button>
            <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
          </div>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          {/* Profile avatar */}
          <div className="relative">
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false) }}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-sm cursor-pointer">
              {user?.avatar && user.avatar !== '👤' ? (
                <span className="text-sm">{user.avatar}</span>
              ) : (
                <span className="text-[11px] font-bold text-white">{initials}</span>
              )}
            </motion.button>
            <ProfilePanel isOpen={showProfile} onClose={() => setShowProfile(false)} />
          </div>

          {/* Logout */}
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-50 transition-all ml-1">
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}
