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

async function cleanupAndre() {
  console.log('Finding Andre entries...');
  
  // Get all Andre helpers
  const { data: andres, error } = await supabase
    .from('helpers')
    .select('id, name, city, verified, created_at')
    .eq('name', 'Andre')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`\nFound ${andres.length} Andre entries:`);
  andres.forEach((a, i) => {
    console.log(`${i + 1}. ID: ${a.id}, City: ${a.city}, Verified: ${a.verified}, Created: ${a.created_at}`);
  });

  // Keep the first one, delete the rest
  const toKeep = andres[0];
  const toDelete = andres.slice(1);

  console.log(`\n✓ Keeping: ${toKeep.id}`);
  console.log(`✗ Deleting ${toDelete.length} duplicates:`);

  for (const andre of toDelete) {
    console.log(`   Deleting: ${andre.id}`);
    const { error: deleteError } = await supabase
      .from('helpers')
      .delete()
      .eq('id', andre.id);
    
    if (deleteError) {
      console.error(`   ❌ Error deleting ${andre.id}:`, deleteError);
    } else {
      console.log(`   ✓ Deleted ${andre.id}`);
    }
  }

  console.log('\n✅ Cleanup complete!');
}

cleanupAndre();


