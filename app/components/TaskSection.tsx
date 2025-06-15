'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TaskSection({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center font-semibold text-gray-800 text-lg mb-2 hover:text-indigo-600 transition"
      >
        {title}
        <span className="text-xl">{isOpen ? '▲' : '▼'}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
