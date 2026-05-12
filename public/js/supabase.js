// Supabase тохиргоо
// АНХААРАХ: Эдгээр нь "anon public" key, аюулгүй (RLS-ээр хамгаалагдсан)
const SUPABASE_URL = 'sb_publishable_WXsZgGEVy-ccvhlSmXdVbg_eIydehOW';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbXNucWRvcmRrY2dheWRyaGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NTA0NzYsImV4cCI6MjA5NDEyNjQ3Nn0.HhPba9z84WukroJTEC3cEA7MmtPerQ7wdOmny9Czy2I';

// CDN-ээс ачаалсан Supabase client
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
