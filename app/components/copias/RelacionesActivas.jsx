'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import { ChevronDown, ChevronUp, Users } from 'lucide-react'

export default function RelacionesActivas({ user }) {
  const [relaciones, setRelaciones] = useState([])
  const [expanded, setExpanded] = useState(true)

  const fetchRelaciones = async () => {
    const { data, error } = await supabase
      .from('relaciones')
      .select(`
        id,
        usuario_origen (id, nombre),
        usuario_destino (id, nombre),
        estado
      `)
      .or(`usuario_origen.eq.${user.id},usuario_destino.eq.${user.id}`)
      .eq('estado', 'aceptada')

    if (error) {
      toast.error('Error al cargar relaciones activas')
      console.error(error)
    } else {
      const relacionesFiltradas = data.map(rel => {
        const otro =
          rel.usuario_origen.id === user.id
            ? rel.usuario_destino
            : rel.usuario_origen
        return {
          id: rel.id,
          nombre: otro.nombre,
          uid: otro.id
        }
      })
      setRelaciones(relacionesFiltradas)
    }
  }

  useEffect(() => {
    fetchRelaciones()
  }, [])

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
          <table className="w-full table-auto border-collapse bg-white">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">👤 Usuario</th>
                <th className="px-6 py-3 text-left font-semibold">🆔 ID</th>
              </tr>
            </thead>
            <tbody>
              {relaciones.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center text-gray-500 py-6">
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
                    <td className="px-6 py-3 text-gray-600">{rel.uid}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
