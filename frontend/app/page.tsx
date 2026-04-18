'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '@/lib/app-context'
import { AnimatedBackground } from '@/components/animated-background'
import { LoginForm } from '@/components/login-form'
import { Dashboard } from '@/components/dashboard'
import { ListDetail } from '@/components/list-detail'
import { StatsView } from '@/components/stats-view'

type View = 'login' | 'dashboard' | 'list' | 'stats'

export default function Home() {
  const { isAuthenticated, logout } = useApp()
  const [currentView, setCurrentView] = useState<View>('login')
  const [selectedListId, setSelectedListId] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated && currentView === 'login') {
      setCurrentView('dashboard')
    } else if (!isAuthenticated && currentView !== 'login') {
      setCurrentView('login')
    }
  }, [isAuthenticated, currentView])

  const handleListSelect = (listId: string) => {
    setSelectedListId(listId)
    setCurrentView('list')
  }

  const handleBack = () => {
    setSelectedListId(null)
    setCurrentView('dashboard')
  }

  const handleLogout = () => {
    logout()
    setCurrentView('login')
  }

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentView === 'login' && (
          <motion.div
            key="login"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <AnimatedBackground />
            <LoginForm onSuccess={() => setCurrentView('dashboard')} />
          </motion.div>
        )}

        {currentView === 'dashboard' && (
          <motion.div
            key="dashboard"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Dashboard
              onListSelect={handleListSelect}
              onLogout={handleLogout}
              onStatsClick={() => setCurrentView('stats')}
            />
          </motion.div>
        )}

        {currentView === 'list' && selectedListId && (
          <motion.div
            key="list"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <ListDetail listId={selectedListId} onBack={handleBack} />
          </motion.div>
        )}

        {currentView === 'stats' && (
          <motion.div
            key="stats"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <StatsView onBack={() => setCurrentView('dashboard')} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
