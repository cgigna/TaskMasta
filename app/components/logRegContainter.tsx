'use client'

import { useState } from 'react'
import LoginForm from './loginForm'
import RegisterForm from './registerform'

export default function AuthContainer() {
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      {isSignUp
        ? <RegisterForm onSwitch={() => setIsSignUp(false)} />
        : <LoginForm onSwitch={() => setIsSignUp(true)} />
      }
    </div>
  )
}
