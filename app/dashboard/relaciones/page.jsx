'use client'

import { useUser } from '../../components/UserContext'
import SolicitarRelacion from '../../components/SolicitarRelacion'

export default function RelacionesPage() {
  const { user } = useUser();

  if (!user) return <p className="p-4 text-gray-500">Cargando usuario...</p>

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">🤝 Relaciones</h1>

        <div className="space-y-6">
          <SolicitarRelacion user={user} />
        
        </div>
      </div>
    </main>
  )
}
