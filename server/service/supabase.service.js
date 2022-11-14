const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

exports.NOT_FOUND_ERROR_CODE = "PGRST116";
exports.client = supabase;
