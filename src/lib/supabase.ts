
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://fezgcnkcmivmtlwasmlv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlemdjbmtjbWl2bXRsd2FzbWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNjE5MDEsImV4cCI6MjA1NTgzNzkwMX0.twaZejY6_3hA1OkCZoc0wgM_VVgKHOYn2gJEfhbEXMI';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
