'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import LoginForm from './loginForm'
import TaskManager from './TaskManager'


export default function HomeClient() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (data?.user) setUser(data.user)
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <div className="p-4">
      {user ? <TaskManager user={user} /> : <LoginForm />}
    </div>
  )
}
