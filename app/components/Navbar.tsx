'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import LogoutButton from './LogOut'
import LoginForm from './loginForm'
import RegisterForm from './registerform'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  useEffect(() => {
    const sessionPromise = supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-4 flex justify-between items-center relative">
      {/* Logo / Nombre */}
      <div className="text-2xl font-semibold text-indigo-600 tracking-tight">📝 Task Masta</div>

      {/* Usuario / Acciones */}
      <div className="flex items-center gap-4 relative">
        {user ? (
          <>
            <span className="text-gray-700 text-sm">Hola, <strong>{user.email}</strong></span>
            <LogoutButton />
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setShowAuth(!showAuth)
                setAuthMode('login') // por defecto mostrar login al abrir
              }}
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition duration-150"
            >
              Iniciar sesión
            </button>

            {showAuth && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg p-4 z-50">
                {authMode === 'login' ? (
                  <LoginForm onSwitch={() => setAuthMode('register')} />
                ) : (
                  <RegisterForm onSwitch={() => setAuthMode('login')} />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  )
}
