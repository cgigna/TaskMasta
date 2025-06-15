'use client'

import { useState } from 'react'

export default function SolicitarRelacionForm({ user, onEnviarSolicitud }) {
  const [correo, setCorreo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('') // 'error' | 'success'

  const handleEnviar = async () => {
    setMensaje('')
    setTipoMensaje('')

    if (!correo) {
      setMensaje('Por favor ingresa un correo válido')
      setTipoMensaje('error')
      return
    }

    const success = await onEnviarSolicitud(correo)
    if (success) {
      setMensaje('✅ Solicitud enviada con éxito.')
      setTipoMensaje('success')
      setCorreo('')
    } else {
      setMensaje('❌ No se pudo enviar la solicitud.')
      setTipoMensaje('error')
    }
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">👥 Solicitar Relación</h2>
      <p className="text-gray-600 mb-4">
        Hola, <span className="font-semibold text-blue-600">{user.nombre}</span> 👋
      </p>

      <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
        Correo del usuario
      </label>
      <input
        id="correo"
        type="email"
        placeholder="ejemplo@email.com"
        value={correo}
        onChange={e => setCorreo(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800 mb-4"
      />

      <button
        onClick={handleEnviar}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200"
      >
        Enviar solicitud
      </button>

      {mensaje && (
        <p className={`text-sm font-medium mt-3 ${tipoMensaje === 'error' ? 'text-red-600' : 'text-green-600'}`}>
          {mensaje}
        </p>
      )}
    </div>
  )
}
