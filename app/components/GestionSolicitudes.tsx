'use client'

import { toast } from 'sonner'
import { Users } from 'lucide-react'

export default function GestionSolicitudes({ solicitudes, loading, onActualizarEstado }) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-6 space-y-4 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Users size={20} />
        Solicitudes pendientes
      </h2>

      {loading ? (
        <p className="text-gray-600">Cargando solicitudes...</p>
      ) : solicitudes.length === 0 ? (
        <p className="text-gray-600">No tienes solicitudes pendientes.</p>
      ) : (
        <ul className="divide-y">
          {solicitudes.map(({ id, usuario_origen }) => (
            <li key={id} className="flex justify-between items-center py-3">
              <span className="text-gray-800 font-medium">👤 {usuario_origen.nombre}</span>
              <div className="space-x-2">
                <button
                  onClick={() => onActualizarEstado(id, 'aceptada')}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => onActualizarEstado(id, 'rechazada')}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Rechazar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
