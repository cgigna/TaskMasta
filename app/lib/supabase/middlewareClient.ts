// lib/supabase/middlewareClient.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { type NextRequest ,NextResponse} from 'next/server'

export const getMiddlewareSupabase = (req: NextRequest,res: NextResponse) => {
  return createMiddlewareClient({ req,res })
}
