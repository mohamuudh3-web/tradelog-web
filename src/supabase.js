import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = 'https://dhrrugmeyrjgubdjnksa.supabase.co'
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRocnJ1Z21leXJqZ3ViZGpua3NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MDE4OTUsImV4cCI6MjA5NzA3Nzg5NX0.5tK1ZKc63kVGDQxHLXiUrynrflwQTJvWItj43_LvIBU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
