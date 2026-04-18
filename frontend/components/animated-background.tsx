'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, ShoppingBag, Store, Tag, Package, Star } from 'lucide-react'

export function AnimatedBackground() {
  const icons = [
    { Icon: ShoppingBag, size: 64, color: 'text-emerald-500/10', start: { left: '15%', top: '25%' }, animate: { y: [0, -30, 0], x: [0, 20, 0] } },
    { Icon: Tag, size: 80, color: 'text-teal-500/10', start: { left: '80%', top: '20%' }, animate: { y: [0, 40, 0], x: [0, -30, 0] } },
    { Icon: Store, size: 70, color: 'text-emerald-400/10', start: { left: '20%', top: '70%' }, animate: { y: [0, -40, 0], x: [0, -20, 0] } },
    { Icon: Package, size: 90, color: 'text-teal-400/10', start: { left: '75%', top: '65%' }, animate: { y: [0, 50, 0], x: [0, 30, 0] } },
    { Icon: Star, size: 60, color: 'text-emerald-300/10', start: { left: '50%', top: '15%' }, animate: { y: [0, -20, 0], x: [0, 40, 0] } },
  ]

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
      
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute ${item.color}`}
          style={{ left: item.start.left, top: item.start.top }}
          animate={{
            y: item.animate.y,
            x: item.animate.x,
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.5,
          }}
        >
          <item.Icon width={item.size} height={item.size} strokeWidth={1.5} />
        </motion.div>
      ))}

      {/* A large subtle shopping cart in the center */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5"
        animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ShoppingCart width={400} height={400} strokeWidth={0.5} />
      </motion.div>
    </div>
  )
}
