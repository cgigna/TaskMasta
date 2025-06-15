'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'
import { PostgrestSingleResponse } from '@supabase/supabase-js'

interface Usuario {
  id: string
  nombre: string
  apellido: string
  email: string
  fecha_creacion: string | null
}

interface UserContextType {
  user: Usuario | null
  loading: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
})

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      setLoading(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user?.id) {
        const response: PostgrestSingleResponse<Usuario> = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (!response.error) {
          setUser(response.data ?? null)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }

      setLoading(false)
    }

    getUser()

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
