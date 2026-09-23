import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): { supabase: SupabaseClient | null; available: boolean } {
  if (supabaseClient) {
    return { supabase: supabaseClient, available: true };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
    try {
      supabaseClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      console.log('✅ [Supabase Client] Connected successfully to Supabase PostgreSQL database.');
      return { supabase: supabaseClient, available: true };
    } catch (err) {
      console.warn('⚠️ [Supabase Client] Failed to initialize Supabase client:', err);
    }
  }

  return { supabase: null, available: false };
}
