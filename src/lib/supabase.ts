import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dsuwqknrixlbuhqtkckd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzdXdxa25yaXhsYnVocXRrY2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NzY1OTMsImV4cCI6MjA1MzE1MjU5M30.FiHpR4CXVr2JdJD1eFUL23wX-f2YMA81_xJlApf_9Ho'

export const supabase = createClient(supabaseUrl, supabaseKey)