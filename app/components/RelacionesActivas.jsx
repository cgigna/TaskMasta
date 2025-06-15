'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Users } from 'lucide-react'
import { Send, Inbox ,Trash} from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '../lib/supabaseClient'

export default function RelacionesActivas({ relaciones, loading, user,eliminarRelacion }) {
  const [expanded, setExpanded] = useState(true)



  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md mb-6">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex justify-between items-center px-6 py-4 cursor-pointer select-none border-b hover:bg-gray-100 rounded-t-xl"
      >
        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
          <Users size={20} />
          Relaciones activas
        </h2>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </div>

      {expanded && (
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-gray-600 p-6 text-center">Cargando relaciones activas...</p>
          ) : (
            <table className="w-full table-auto border-collapse bg-white">
              <thead className="bg-blue-100 text-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">👤 Usuario</th>
                  <th className="px-6 py-3 text-left font-semibold">🆔 ID</th>
                  <th className="px-6 py-3 text-left font-semibold">🔁 Rol</th>
                  <th className="px-2 py-3 text-left font-semibold"> Acción</th>
                </tr>
              </thead>
              <tbody>
                {relaciones.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center text-gray-500 py-6">
                      No hay relaciones activas.
                    </td>
                  </tr>
                ) : (
                  relaciones.map(rel => (
                    <tr
                      key={rel.id}
                      className="hover:bg-blue-50 transition duration-200 border-t"
                    >
                      <td className="px-6 py-3 text-gray-800">{rel.nombre}</td>
                      <td className="px-6 py-3 text-gray-600">{rel.uid}- {rel.id}</td>
                      <td className="px-6 py-3">
                              {rel.rol === 'origen' ? (
                                <span className="inline-flex items-center gap-1 text-blue-600">
                                  <Send size={16} /> <span className="text-sm">Puedes asignar tareas</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-green-600">
                                  <Inbox size={16} /> <span className="text-sm">Te pueden asignar tareas</span>
                                </span>
                              )}
                      </td>
                     <td className="px-6 py-3">
                        <button
                          onClick={() => eliminarRelacion(rel.id)}
                          className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-full transition-colors"
                          title="Eliminar relación"
                        >
                          <Trash size={18} />
                        </button>
                      </td>



                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
