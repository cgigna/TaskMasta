// lib/api.ts
import { supabase } from './supabaseClient'

export const insertarTarea = async (tarea: {
  titulo: string
  usuario_id: number
  fecha_inicio: string // formato 'YYYY-MM-DD'
  fecha_fin: string
  estado: string
}) => {
  const { data, error } = await supabase.from('tareas').insert([
    {
      ...tarea,
      modificado_a: new Date().toISOString(),
    },
  ])

  if (error) {
    console.error('Error insertando tarea:', error.message)
    return { error }
  }

  return { data }
}
