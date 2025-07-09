import { createClient } from '@supabase/supabase-js'

// Project ID will be auto-injected during deployment
const SUPABASE_URL = 'https://ssfafkapfahcfwegvdfu.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzZmFma2FwZmFoY2Z3ZWd2ZGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3ODQwNTgsImV4cCI6MjA2NzM2MDA1OH0.a6IZoBCLlJ_I5Z8MtLNIu8KFdAYtlLVAFzAdNWGB68g'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>' ){
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})