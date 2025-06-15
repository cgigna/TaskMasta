'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import SolicitarRelacionForm from './SolicitarRelacionForm'
import GestionSolicitudes from './GestionSolicitudes'
import RelacionesActivas from './RelacionesActivas'

interface Solicitud {
  id: string | number
  estado: string
  usuario_origen: {
    id: string
    nombre: string
  }
}


export default function SolicitarRelacion({ user }:any) {
 const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])

const [relaciones, setRelaciones] = useState<any[]>([]) 
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true)
  const [loadingRelaciones, setLoadingRelaciones] = useState(true)

  const fetchSolicitudes = async () => {
    setLoadingSolicitudes(true)
    const { data, error } = await supabase
      .from('relaciones')
      .select('id, usuario_origen (id, nombre), estado')
      .eq('usuario_destino', user.id)
      .eq('estado', 'pendiente')

    if (error) {
    toast.error('Error cargando solicitudes')
    console.error(error)
  } 

  if (data) {
    // Aquí forzamos usuario_origen a ser objeto, no array
    const solicitudesFormateadas = data.map((item: any) => ({
      id: item.id,
      estado: item.estado,
      usuario_origen: Array.isArray(item.usuario_origen)
        ? item.usuario_origen[0]
        : item.usuario_origen,
    })) as Solicitud[]

    setSolicitudes(solicitudesFormateadas)
  }
  setLoadingSolicitudes(false)
}



  const fetchRelaciones = async () => {
    setLoadingRelaciones(true)
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
        console.log(rel)  

        const yoSoyOrigen = rel.usuario_origen[0] === user.id
        const otro:any =
          rel.usuario_origen[0] === user.id
            ? rel.usuario_destino
            : rel.usuario_origen

          console.log("info",otro.id)
            
        return {
          id: rel.id,
          nombre: otro.nombre,
          uid: otro.id,
          rol: yoSoyOrigen ? 'origen' : 'destino'
        }
      })
      setRelaciones(relacionesFiltradas)
    }
    setLoadingRelaciones(false)
  }

  useEffect(() => {
    fetchSolicitudes()
    fetchRelaciones()
  }, [])

  const actualizarEstado = async (id:string, nuevoEstado:string) => {
    const { error } = await supabase
      .from('relaciones')
      .update({ estado: nuevoEstado })
      .eq('id', id)

    if (error) {
      toast.error('Error actualizando solicitud')
      console.error(error)
      return false
    }

    toast.success(`Solicitud ${nuevoEstado.toLowerCase()}`)
    // Refrescar datos para sincronizar vistas
    await Promise.all([fetchSolicitudes(), fetchRelaciones()])
    return true
  }

  const enviarSolicitud = async (correoDestino:string): Promise<boolean> => {
    const { data: usuarios, error } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', correoDestino)

    if (error) {
      toast.error('Error buscando usuario')
      return false
    }
    if (!usuarios || usuarios.length === 0) {
      toast.error('Usuario no encontrado')
      return false
    }
    const usuarioDestino = usuarios[0]
    const { error: insertError } = await supabase
      .from('relaciones')
      .insert({
        usuario_origen: user.id,
        usuario_destino: usuarioDestino.id,
        estado: 'pendiente',
      })

    if (insertError) {
      if (insertError.message.includes('relaciones_unicas')) {
        toast.error('Relación ya existente ❌')
      } else {
        toast.error('Error al enviar la solicitud.')
      }
      return false
    }
    toast.success('Solicitud enviada con éxito ✅')
    await fetchSolicitudes()
    return true
  }

  
const eliminarRelacion = (id:string) => {
  toast.custom(
    (t) => (
      <div className="space-y-2">
        <p className="text-sm text-gray-800">¿Estás seguro de eliminar esta relación?</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              toast.dismiss(t) // cierra el toast
            }}
            className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t)

              const { error } = await supabase
                .from('relaciones')
                .delete()
                .eq('id', id)

              if (error) {
                toast.error('❌ Error al eliminar la relación')
              } else {
                toast.success('✅ Relación eliminada')
                fetchRelaciones()
              }
            }}
            className="px-3 py-1 text-sm rounded bg-red-600 hover:bg-red-700 text-white"
          >
            Eliminar
          </button>
        </div>
      </div>
    ),
    {
      duration: 10000,
    }
  )
}

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <SolicitarRelacionForm onEnviarSolicitud={enviarSolicitud} user={user} />
      <GestionSolicitudes
        solicitudes={solicitudes}
        loading={loadingSolicitudes}
        onActualizarEstado={actualizarEstado}
      />
      <RelacionesActivas
        relaciones={relaciones}
        loading={loadingRelaciones}
        user={user}
        eliminarRelacion={eliminarRelacion}
      />
    </div>
  )
}
