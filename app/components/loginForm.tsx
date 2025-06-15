'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    setError('')
    if (!email || !password) {
      setError('Por favor ingresa correo y contraseña.')
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {setError(error.message)
    }else {
    // Login correcto, redirigir a dashboard
    router.push('/dashboard/tareas')
    }
    
    
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>
      {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" type="email" className="mb-2 w-full p-2 border rounded text-black" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" type="password" className="mb-4 w-full p-2 border rounded text-black" />

      <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Iniciar sesión</button>

      <p className="text-sm text-center mt-4">
        ¿No tienes cuenta?{' '}
        <button onClick={onSwitch} className="text-blue-600 hover:underline">Regístrate</button>
      </p>
    </div>
  )
}
