import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupDuplicates() {
  // Get all helpers
  const { data: helpers, error } = await supabase
    .from('helpers')
    .select('id, name, city, verified, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  // Group by name
  const byName = {};
  helpers.forEach(h => {
    if (!byName[h.name]) byName[h.name] = [];
    byName[h.name].push(h);
  });

  let deletedCount = 0;

  // For each name with duplicates, keep the first and delete the rest
  for (const [name, instances] of Object.entries(byName)) {
    if (instances.length > 1) {
      console.log(`\n⚠️  "${name}" has ${instances.length} instances`);
      const toKeep = instances[0];
      const toDelete = instances.slice(1);

      console.log(`   ✓ Keeping: ${toKeep.id} (created: ${toKeep.created_at})`);
      
      for (const dup of toDelete) {
        console.log(`   ✗ Deleting: ${dup.id}`);
        const { error: deleteError } = await supabase
          .from('helpers')
          .delete()
          .eq('id', dup.id);
        
        if (deleteError) {
          console.error(`      ❌ Error:`, deleteError);
        } else {
          deletedCount++;
        }
      }
    }
  }

  console.log(`\n✅ Cleanup complete! Deleted ${deletedCount} duplicate helpers.`);
}

cleanupDuplicates();


