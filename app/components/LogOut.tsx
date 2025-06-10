'use client'

import { supabase } from '../lib/supabaseClient'

export default function LogoutButton() {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error al cerrar sesión:', error.message)
    } else {
      // Aquí puedes redirigir o actualizar la UI según necesites
      console.log('Sesión cerrada correctamente')
      window.location.reload() // refresca la página para actualizar el estado
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
    >
      Cerrar sesión
    </button>
  )
}
