import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://otxddnfjgdjwaevzddpp.supabase.co";
const supabaseAnon =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90eGRkbmZqZ2Rqd2FldnpkZHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTUwNzcsImV4cCI6MjA3ODk5MTA3N30.XaVW2rebob5BG9Funb3JazYQLiYtXn-lSVvrzPwIhP8";

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    storage: window.localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
