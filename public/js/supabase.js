// Supabase тохиргоо
// АНХААРАХ: Эдгээр нь "anon public" key, аюулгүй (RLS-ээр хамгаалагдсан)
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

// CDN-ээс ачаалсан Supabase client
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
