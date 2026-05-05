import { createClient } from "@supabase/supabase-js";

// Replace these with your Supabase credentials
// Find these in your Supabase project settings at https://supabase.com
const SUPABASE_URL = "{{https://ahhivlmjrqmsiyiplqqm.supabase.co}}";
const SUPABASE_PUBLIC_KEY = "{{sb_publishable_ufe-8w60Z8X_sbSEKNenAQ_tllbsgfg}}";

// Create and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
