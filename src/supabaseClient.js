// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mbksobahlnvqnihwvwmj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ia3NvYmFobG52cW5paHd2d21qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MjUyNzgsImV4cCI6MjA2MTEwMTI3OH0.B7VrNFmi-hlGuQ7ANCF3wbbDpJj9evmNkX_RiNaSypU'; // Use anon if frontend, service role if backend-only
export const supabase = createClient(supabaseUrl, supabaseKey);


export default supabase