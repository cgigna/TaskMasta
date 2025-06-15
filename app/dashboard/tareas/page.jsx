'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import TaskManager from '../../components/TaskManager'


export default function HomePage() {


    const [user, setUser] = useState(null)
    
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
 
    
    <main className="">
     
       <div className="">
      {user ? <TaskManager user={user} /> : <span>cargando</span>}
        </div>
      
      
    </main>
  )
}
