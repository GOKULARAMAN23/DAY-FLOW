import { createClient } from '@supabase/supabase-js';

// Retrieve from localStorage or fallback to standard demo placeholder
const getSupabaseConfig = () => {
  const customUrl = localStorage.getItem('dayflow_supabase_url');
  const customKey = localStorage.getItem('dayflow_supabase_key');

  const supabaseUrl = customUrl || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 'https://mockproject.supabase.co';
  const supabaseKey = customKey || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockKey';

  return { supabaseUrl, supabaseKey, isCustom: Boolean(customUrl && customKey) };
};

const config = getSupabaseConfig();

export const supabase = createClient(config.supabaseUrl, config.supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

export const updateSupabaseCredentials = (url, key) => {
  if (url && key) {
    localStorage.setItem('dayflow_supabase_url', url);
    localStorage.setItem('dayflow_supabase_key', key);
  } else {
    localStorage.removeItem('dayflow_supabase_url');
    localStorage.removeItem('dayflow_supabase_key');
  }
  window.location.reload();
};

export const getSupabaseStatus = () => {
  const conf = getSupabaseConfig();
  return {
    configured: conf.isCustom,
    url: conf.supabaseUrl
  };
};
