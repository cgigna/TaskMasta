
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const UserContext = createContext({
  user: null,
  loading: true,
})

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      setLoading(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user?.id) {
        // Busca en tu tabla "usuarios"
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (!error) setUser(data)
      }

      setLoading(false)
    }

    getUser()

    // Escuchar cambios de sesión
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      getUser()
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
