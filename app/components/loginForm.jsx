'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const handleAuth = async () => {
    setError('')
    if (!email || !password) {
      setError('Por favor ingresa correo y contraseña.')
      return
    }

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="max-w-sm w-full bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
      </h2>

      {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Correo electrónico</label>
        <input
          type="email"
          className="w-full p-2 border rounded-lg text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ejemplo@correo.com"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Contraseña</label>
        <input
          type="password"
          className="w-full p-2 border rounded-lg text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      <button
        onClick={handleAuth}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {isSignUp ? 'Registrarse' : 'Iniciar sesión'}
      </button>

      <p className="text-sm text-center mt-4">
        {isSignUp ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'}{' '}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-600 hover:underline"
        >
          {isSignUp ? 'Inicia sesión' : 'Regístrate'}
        </button>
      </p>
    </div>
  )
}
