import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grepgkzgahzzzriaoqwe.supabase.co';
const supabaseKey = 'sb_publishable_sD650cvt99ICNPqOuLqmTw_N3THOtYT';

export const supabase = createClient(supabaseUrl, supabaseKey);