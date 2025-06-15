// lib/supabase/middlewareClient.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { type NextRequest } from 'next/server'

export const getMiddlewareSupabase = (req: NextRequest) => {
  return createMiddlewareClient({ req })
}
