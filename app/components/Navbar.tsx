'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import LogoutButton from './LogOut'
import LoginForm from './loginForm'  // asumiendo que ya tienes este componente
import {User} from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Escuchar cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <div className="text-lg font-bold">📝 Task Masta</div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span>Hola, {user.email}</span>
            <LogoutButton />
          </>
        ) : (
          <>
            <button
              onClick={() => setShowLogin(!showLogin)}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Iniciar sesión
            </button>
            {showLogin && (
              <div className="absolute right-6 top-16 bg-white p-4 rounded shadow-lg z-50">
                <LoginForm />
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  )
}
