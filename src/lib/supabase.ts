import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://holkskpaacgaadfdltof.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvbGtza3BhYWNnYWFkZmRsdG9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MTM4NDIsImV4cCI6MjA1MDI4OTg0Mn0.cAJjZO-9KCJZsSFngU4P-itokZ-qlhiNU5UNHfWrIKk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
