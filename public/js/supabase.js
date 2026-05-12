// Supabase тохиргоо
// АНХААРАХ: Эдгээр нь "anon public" key, аюулгүй (RLS-ээр хамгаалагдсан)
const SUPABASE_URL = 'wamsnqdordkcgaydrhdb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_hgW7psub8ZS5a-Ukwo6TYg_Rnn_cPnJ';

// CDN-ээс ачаалсан Supabase client
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
