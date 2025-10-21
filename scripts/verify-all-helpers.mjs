import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyAllHelpers() {
  console.log('Fetching all helpers...');
  
  const { data: helpers, error } = await supabase
    .from('helpers')
    .select('id, name, city, verified')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`\nFound ${helpers.length} helpers:\n`);

  for (const helper of helpers) {
    console.log(`${helper.verified ? '✓' : '✗'} ${helper.name} (${helper.city}) - Verified: ${helper.verified}`);
    
    if (!helper.verified) {
      console.log(`   → Verifying ${helper.name}...`);
      const { error: updateError } = await supabase
        .from('helpers')
        .update({ verified: true })
        .eq('id', helper.id);
      
      if (updateError) {
        console.error(`   ❌ Error:`, updateError);
      } else {
        console.log(`   ✓ Verified!`);
      }
    }
  }

  console.log('\n✅ All helpers are now verified!');
}

verifyAllHelpers();


