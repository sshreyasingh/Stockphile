const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Load from environment variables (NEVER hardcode keys)
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE; // 🔑 service role

console.log("✅ Supabase URL:", supabaseUrl);
console.log("✅ Service role key loaded?", !!serviceRoleKey);

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey); // Use service role key here

module.exports = supabaseAdmin;
