'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, LogOut, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/app-context'

interface NavbarProps {
  onLogout: () => void
  onStatsClick: () => void
}

export function Navbar({ onLogout, onStatsClick }: NavbarProps) {
  const { user } = useApp()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">MercaList</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onStatsClick}
            className="rounded-xl"
          >
            <BarChart3 className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-3 ml-2">
            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary">{user?.avatar}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="rounded-xl text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
