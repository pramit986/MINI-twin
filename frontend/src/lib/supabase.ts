import { createClient } from '@supabase/supabase-js';
// using any for now since we haven't generated types

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey);
