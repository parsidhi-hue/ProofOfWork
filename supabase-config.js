const SUPABASE_URL = "https://vgalqlkrxpwtzilnzzmt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_f7dC3NQLXLxYkH-DqtT45w_7p6e6uWI";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);