'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'


export default function SolicitarRelacion({ user }) {
  const [correo, setCorreo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('') // 'error' | 'success'

  const verificarYEnviarSolicitud = async () => {
    setMensaje('')
    setTipoMensaje('')

    const { data: usuarios, error } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', correo)

    if (error) {
      console.log('❌ Error buscando usuario:', error.message)
      setMensaje('Hubo un error al buscar el usuario.')
      setTipoMensaje('error')
      
      
      return
    }

    if (!usuarios || usuarios.length === 0) {
      setMensaje('❌ Usuario no encontrado.')
      setTipoMensaje('error')
      return
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
      console.error('❌ Error enviando solicitud:', insertError.message)
      setMensaje('Error al enviar la solicitud.')
      setTipoMensaje('error')
      if (insertError.message==='duplicate key value violates unique constraint "relaciones_unicas"'){
        toast.error('Relacion ya existente ❌')
      }
    } else {
      setMensaje('✅ Solicitud enviada con éxito.')
      setTipoMensaje('success')
      setCorreo('')
    }
  }

 
  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-4 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800">👥 Solicitar Relación</h2>
      <p className="text-gray-600">
        Hola, <span className="font-semibold text-blue-600">{user.nombre}</span> 👋
      </p>

      <div>
        <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
          Correo del usuario
        </label>
        <input
          id="correo"
          type="email"
          placeholder="ejemplo@email.com"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
        />
      </div>

      <button
        onClick={verificarYEnviarSolicitud}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200"
      >
        Enviar solicitud
      </button>

      {mensaje && (
        <p className={`text-sm font-medium ${tipoMensaje === 'error' ? 'text-red-600' : 'text-green-600'}`}>
          {mensaje}
        </p>
      )}
    </div>
  )
}