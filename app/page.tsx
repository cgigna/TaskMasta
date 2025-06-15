'use client'

import Navbar from './components/Navbar'
import LoginForm from './components/loginForm'
import RegisterForm from './components/registerform'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from './lib/supabaseClient'

export default function HomePage() {
  const [showAuth, setShowAuth] = useState<'login' | 'register' | null>(null)
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(true)  // <-- loading para check sesión
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        router.push('/dashboard/tareas')
      } else {
        setLoading(false) // No hay usuario, terminamos loading para mostrar UI
      }
    }
    checkSession()
  }, [router])

  useEffect(() => {
    if (showAuth) {
      setVisible(true)
    } else {
      const timeout = setTimeout(() => setVisible(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [showAuth])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-indigo-50">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>

        <style jsx>{`
          .loader {
            border-top-color: #4f46e5; /* indigo-600 */
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}</style>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-700 mb-6 drop-shadow-md">
            Bienvenido a <span className="text-indigo-900">Task Masta</span>
          </h1>

          <p className="text-lg md:text-xl text-indigo-600 mb-10 leading-relaxed max-w-xl mx-auto">
            Gestiona tus tareas y relaciones con otros usuarios de forma sencilla y segura. 
            Organiza tu día, colabora y mejora tu productividad.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setShowAuth('login')}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
            >
              Iniciar sesión
            </button>

            <button
              onClick={() => setShowAuth('register')}
              className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition"
            >
              Crear cuenta
            </button>
          </div>

          {visible && (
            <div
              className={`mt-10 max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg ${
                showAuth ? 'fadeInUp' : 'fadeOutDown'
              }`}
            >
              {showAuth === 'login' ? (
                <LoginForm onSwitch={() => setShowAuth('register')} />
              ) : (
                <RegisterForm onSwitch={() => setShowAuth('login')} />
              )}
              <button
                onClick={() => setShowAuth(null)}
                className="mt-4 text-sm text-gray-500 hover:underline"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-indigo-100 py-6 mt-auto text-center text-indigo-700">
        © 2025 Task Masta. Todos los derechos reservados.
      </footer>
    </>
  )
}
