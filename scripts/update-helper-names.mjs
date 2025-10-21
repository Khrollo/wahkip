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
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateHelperNames() {
  console.log('Fetching helpers...');
  
  // Get all helpers
  const { data: helpers, error: fetchError } = await supabase
    .from('helpers')
    .select('id, name')
    .order('created_at', { ascending: true });

  if (fetchError) {
    console.error('Error fetching helpers:', fetchError);
    return;
  }

  console.log(`Found ${helpers.length} helpers`);
  
  // Update first 3 helpers
  const newNames = ['Andre', 'Bianca', 'Carl'];
  
  for (let i = 0; i < Math.min(3, helpers.length); i++) {
    const helper = helpers[i];
    const newName = newNames[i];
    
    console.log(`Updating helper ${i + 1}: ${helper.name} → ${newName}`);
    
    const { error: updateError } = await supabase
      .from('helpers')
      .update({ name: newName })
      .eq('id', helper.id);
    
    if (updateError) {
      console.error(`Error updating ${helper.name}:`, updateError);
    } else {
      console.log(`✓ Updated: ${newName}`);
    }
  }
  
  console.log('✅ Helper name updates complete!');
}

updateHelperNames();


