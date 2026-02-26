require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
    console.log("Testing Supabase connection...");
    const { data, error } = await supabase.from('mentee_profiles').select('id').limit(1);
    if (error) {
        console.error("Supabase Error:", error.message);
    } else {
        console.log("Supabase Success, table exists. Data:", data);
    }
}

test();
