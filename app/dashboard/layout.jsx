// app/dashboard/layout.jsx
'use client'

import Link from "next/link"
import Navbar from "../components/Navbar" // Asegúrate que esté bien importado

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar fijo arriba */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Sidebar + contenido */}
      <div className="flex pt-16 min-h-screen h-screen"> {/* 👈 clave: min-h-screen + h-screen */}
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col shadow-sm">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">Menú</h2>
  <nav className="flex flex-col gap-2">
    <Link href="/dashboard/relaciones" className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-md transition">
      🔗 Relaciones
    </Link>
    <Link href="/dashboard/tareas" className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-md transition">
      📋 Tareas
    </Link>
  </nav>
</aside>

        {/* Contenido principal */}
        <main className="flex-1 p-8 bg-gray-50 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
