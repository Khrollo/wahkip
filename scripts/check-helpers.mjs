import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;

console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Service Role Key:', supabaseKey ? 'Found' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkHelpers() {
  console.log('Fetching all helpers...');
  
  const { data: helpers, error } = await supabase
    .from('helpers')
    .select('id, name, city, verified')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`\nTotal helpers: ${helpers.length}\n`);
  
  // Group by name
  const byName = {};
  helpers.forEach(h => {
    if (!byName[h.name]) byName[h.name] = [];
    byName[h.name].push(h);
  });

  // Show duplicates
  Object.entries(byName).forEach(([name, instances]) => {
    if (instances.length > 1) {
      console.log(`⚠️  "${name}" appears ${instances.length} times:`);
      instances.forEach((h, i) => {
        console.log(`   ${i + 1}. ID: ${h.id}, City: ${h.city}, Verified: ${h.verified}`);
      });
      console.log('');
    }
  });

  // Show all helpers
  console.log('\nAll helpers:');
  helpers.forEach((h, i) => {
    console.log(`${i + 1}. ${h.name} (${h.city}) - ID: ${h.id}`);
  });
}

checkHelpers();


