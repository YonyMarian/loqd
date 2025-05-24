//require('dotenv').config()
import 'dotenv/config';
//const { createClient } = require('@supabase/supabase-js');
import {createClient, SupabaseClient} from '@supabase/supabase-js';

// see .env file, make sure not to share!!
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY as string;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

//module.exports = supabase;
export default supabase;