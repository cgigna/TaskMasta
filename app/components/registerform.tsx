'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'

export default function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

const handleSignUp = async () => {
  if (!nombre || !apellido || !email || !password) {
    toast.error('Por favor completa todos los campos.')
    return
  }

  setLoading(true)

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre, apellido },
      },
    })

    console.log('📦 Supabase signUp response:', { data, error })

    if (error) {
      toast.error(error.message)
      return
    }

    const identities = data.user?.identities ?? []

    if (identities.length === 0) {
      // Usuario ya registrado y confirmado
      toast.error('Este correo ya está registrado y confirmado. Intenta iniciar sesión.')
      return
    }

    toast.success('Registro exitoso, revisa tu correo para confirmar tu cuenta.')

    onSwitch()
    setNombre('')
    setApellido('')
    setEmail('')
    setPassword('')
  } catch (err: any) {
    console.error('🔥 Error inesperado:', err)
    toast.error('Error inesperado: ' + (err.message ?? 'Sin mensaje'))
  } finally {
    setLoading(false)
  }
}


  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Crear cuenta</h2>

      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" className="mb-2 w-full p-2 border rounded text-black" />
      <input value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Apellido" className="mb-2 w-full p-2 border rounded text-black" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" type="email" className="mb-2 w-full p-2 border rounded text-black" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" type="password" className="mb-4 w-full p-2 border rounded text-black" />

      <button
        onClick={handleSignUp}
        disabled={loading}
        className={`w-full py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>

      <p className="text-sm text-center mt-4">
        ¿Ya tienes cuenta?{' '}
        <button onClick={onSwitch} className="text-blue-600 hover:underline">
          Inicia sesión
        </button>
      </p>
    </div>
  )
}
