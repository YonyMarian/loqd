require('dotenv').config()
const { createClient } = require('@supabase/supabase-js');

// see .env file, make sure not to share!!
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;