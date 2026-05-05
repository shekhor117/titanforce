// Supabase Connection Setup
// ========================
// Replace the values below with your own Supabase credentials

import { createClient } from "@supabase/supabase-js";

// TODO: Replace these with your actual Supabase credentials
const SUPABASE_URL = "{{https://ahhivlmjrqmsiyiplqqm.supabase.co}}";
const SUPABASE_PUBLIC_KEY = "{{sb_publishable_ufe-8w60Z8X_sbSEKNenAQ_tllbsgfg}}";

// Initialize and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
