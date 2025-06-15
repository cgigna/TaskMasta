'use client'
import { useRouter } from 'next/navigation'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createPagesBrowserClient()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error al cerrar sesión:', error.message)
    } else {
      router.push('/')
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
    >
      Cerrar sesión
    </button>
  )
}
