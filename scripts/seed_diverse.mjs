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

// Helper function to get random capacity
function getRandomCapacity() {
  const options = ['low', 'medium', 'high'];
  return options[Math.floor(Math.random() * options.length)];
}

// Helper function to generate future dates
function getFutureDate(daysOffset = 0, hoursOffset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(date.getHours() + hoursOffset);
  return date.toISOString();
}

const events = [
  // RESTAURANTS
  {
    title: "The Coppers - Live Jazz Night",
    description: "Weekly event every Friday from 7pm-11pm. Enjoy fine dining with live jazz performances in an elegant atmosphere.",
    date_start: getFutureDate(2, 19),
    tags: ["food", "music", "nightlife"],
    city: "Kingston",
    capacity: getRandomCapacity(),
    capacity: getRandomCapacity(),
  },
  {
    title: "Oceano - Seafood Festival",
    description: "Monthly event on the last Saturday. Fresh seafood specials with Caribbean flavors and ocean views.",
    date_start: getFutureDate(7, 18),
    tags: ["food", "culture"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Chillin - Reggae Brunch",
    description: "Every Sunday from 11am-3pm. Bottomless mimosas, jerk chicken, and live reggae music.",
    date_start: getFutureDate(1, 11),
    tags: ["food", "music", "family"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Epican Tapas - Wine & Dine",
    description: "Weekly event every Wednesday from 6pm-10pm. Spanish tapas paired with curated wine selections.",
    date_start: getFutureDate(4, 18),
    tags: ["food", "culture"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Di Lot Restaurant - Caribbean Fusion Night",
    description: "Every Thursday from 7pm-11pm. Modern Caribbean cuisine with live acoustic performances.",
    date_start: getFutureDate(3, 19),
    tags: ["food", "music"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },

  // CLUBS
  {
    title: "Ribbiz - Dancehall Night",
    description: "Weekly event every Saturday from 10pm-4am. The hottest dancehall vibes with top DJs.",
    date_start: getFutureDate(3, 22),
    tags: ["music", "nightlife"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Meca - EDM Night",
    description: "Monthly event on first Friday. International DJs and electronic dance music.",
    date_start: getFutureDate(5, 22),
    tags: ["music", "nightlife"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Taboo - Hip Hop Night",
    description: "Weekly event every Friday from 9pm-3am. Hip hop, R&B, and urban vibes.",
    date_start: getFutureDate(2, 21),
    tags: ["music", "nightlife"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Circuit Club - Latin Night",
    description: "Every Thursday from 8pm-2am. Salsa, bachata, and reggaeton with live band.",
    date_start: getFutureDate(4, 20),
    tags: ["music", "nightlife", "culture"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "PRYZM Kingston - VIP Experience",
    description: "Weekly event every Saturday from 11pm-5am. Premium bottle service and international DJs.",
    date_start: getFutureDate(3, 23),
    tags: ["music", "nightlife"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },

  // CREATIVE
  {
    title: "Pottery Workshop - Wheel Throwing",
    description: "Weekly workshop every Saturday from 10am-1pm. Learn pottery techniques in a creative environment.",
    date_start: getFutureDate(3, 10),
    tags: ["art", "culture", "wellness"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Creative Cooking Class - Jamaican Flavors",
    description: "Every Sunday from 2pm-5pm. Learn to cook traditional Jamaican dishes with modern twists.",
    date_start: getFutureDate(1, 14),
    tags: ["food", "culture", "art"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Slam Poetry Open Mic",
    description: "Weekly event every Tuesday from 7pm-10pm. Share your poetry or enjoy performances by local artists.",
    date_start: getFutureDate(5, 19),
    tags: ["art", "culture", "music"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },

  // WELLNESS
  {
    title: "Run Club - Hope Gardens",
    description: "Weekly run every Saturday at 6am. 5K and 10K routes through beautiful gardens.",
    date_start: getFutureDate(3, 6),
    tags: ["wellness", "sports"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Pickleball Tournament",
    description: "Monthly tournament on second Sunday from 9am-2pm. All skill levels welcome.",
    date_start: getFutureDate(8, 9),
    tags: ["sports", "wellness"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Football Factory - 5v5 League",
    description: "Weekly matches every Wednesday from 7pm-10pm. Competitive indoor football.",
    date_start: getFutureDate(4, 19),
    tags: ["sports"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Iron Lotus - Power Yoga",
    description: "Daily classes from 6am-8pm. Vinyasa flow and hot yoga sessions.",
    date_start: getFutureDate(0, 7),
    tags: ["wellness"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Irie Spa - Wellness Day",
    description: "Weekly event every Sunday from 10am-6pm. Massages, facials, and relaxation packages.",
    date_start: getFutureDate(1, 10),
    tags: ["wellness"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Pilates & Core Strength",
    description: "Daily classes from 7am-8pm. Mat and reformer pilates for all levels.",
    date_start: getFutureDate(0, 8),
    tags: ["wellness"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Freedom Skate Park - Skate Jam",
    description: "Weekly event every Saturday from 2pm-6pm. Skateboarding competitions and free skate sessions.",
    date_start: getFutureDate(3, 14),
    tags: ["sports", "wellness"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },

  // CAFES
  {
    title: "Cafe Blue - Live Acoustic Sessions",
    description: "Weekly event every Thursday from 6pm-9pm. Coffee, pastries, and live acoustic music.",
    date_start: getFutureDate(4, 18),
    tags: ["food", "music", "culture"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Cannonball Cafe - Poetry Reading",
    description: "Every Friday from 7pm-9pm. Local poets share their work in an intimate setting.",
    date_start: getFutureDate(2, 19),
    tags: ["art", "culture", "food"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },

  // HERITAGE SITES
  {
    title: "Bob Marley Museum - Guided Tour",
    description: "Daily tours from 9am-4pm. Learn about the legend's life and legacy.",
    date_start: getFutureDate(0, 10),
    tags: ["culture", "heritage"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Fort Charles - Historical Tour",
    description: "Daily tours from 9am-5pm. Explore Jamaica's colonial history and naval heritage.",
    date_start: getFutureDate(0, 11),
    tags: ["culture", "heritage"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Trench Town Culture Yard",
    description: "Daily tours from 9am-5pm. Visit the birthplace of reggae music.",
    date_start: getFutureDate(0, 10),
    tags: ["culture", "heritage", "music"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "National Gallery - Art Exhibition",
    description: "Daily from 10am-5pm. Contemporary Jamaican art and cultural exhibitions.",
    date_start: getFutureDate(0, 10),
    tags: ["art", "culture"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Ward Theatre - Live Performance",
    description: "Weekly performances every Friday at 8pm. Local theatre productions.",
    date_start: getFutureDate(2, 20),
    tags: ["art", "culture"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Little Theatre - Musical Night",
    description: "Weekly event every Saturday at 8pm. Broadway-style musicals and performances.",
    date_start: getFutureDate(3, 20),
    tags: ["art", "music", "culture"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },

  // NATURE
  {
    title: "Blue Mountain Hike - Sunrise Trek",
    description: "Weekly hike every Saturday at 4am. Experience Jamaica's highest peak at sunrise.",
    date_start: getFutureDate(3, 4),
    tags: ["wellness", "nature"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Bob Marley Beach - Day Trip",
    description: "Daily from 9am-5pm. Relax on the beach, enjoy water sports and local food.",
    date_start: getFutureDate(1, 9),
    tags: ["nature", "wellness", "food"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Holywell - Nature Walk",
    description: "Daily from 8am-4pm. Guided nature walks through tropical rainforest.",
    date_start: getFutureDate(0, 9),
    tags: ["nature", "wellness"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Waterfront - Sunset Yoga",
    description: "Daily at 6pm. Yoga sessions by the water with stunning sunset views.",
    date_start: getFutureDate(0, 18),
    tags: ["wellness", "nature"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Hope Gardens - Picnic Day",
    description: "Daily from 9am-6pm. Perfect for families, couples, and groups.",
    date_start: getFutureDate(1, 10),
    tags: ["nature", "family"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Emancipation Park - Morning Walk",
    description: "Daily from 6am-8pm. Peaceful walks in the heart of Kingston.",
    date_start: getFutureDate(0, 7),
    tags: ["wellness", "nature"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },

  // MUSIC
  {
    title: "Album Listening Party - New Releases",
    description: "Weekly event every Wednesday from 8pm-11pm. Listen to new reggae and dancehall albums.",
    date_start: getFutureDate(5, 20),
    tags: ["music", "culture"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Dub Club - Roots Reggae Night",
    description: "Weekly event every Sunday from 8pm-2am. Authentic dub and roots reggae vibes.",
    date_start: getFutureDate(1, 20),
    tags: ["music", "culture"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Juss Buss Acoustic - Intimate Sessions",
    description: "Weekly event every Tuesday from 7pm-10pm. Acoustic performances in a cozy setting.",
    date_start: getFutureDate(5, 19),
    tags: ["music", "culture"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Karaoke Night - Sing Your Heart Out",
    description: "Weekly event every Thursday from 8pm-12am. Fun karaoke with friends.",
    date_start: getFutureDate(4, 20),
    tags: ["music", "nightlife"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Open Mic - Talent Showcase",
    description: "Weekly event every Monday from 7pm-10pm. Showcase your musical talent.",
    date_start: getFutureDate(6, 19),
    tags: ["music", "art"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },

  // ART
  {
    title: "Edna Manley Showcase - Gallery Opening",
    description: "Monthly event on first Friday from 6pm-9pm. Contemporary Jamaican art exhibitions.",
    date_start: getFutureDate(5, 18),
    tags: ["art", "culture"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Statue Center - Sculpture Walk",
    description: "Daily from 10am-6pm. Explore outdoor sculptures and installations.",
    date_start: getFutureDate(0, 10),
    tags: ["art", "culture"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },

  // PARTIES
  {
    title: "ILS - Island Life Sundays",
    description: "Weekly party every Sunday from 3pm-10pm. Pool party vibes with DJs.",
    date_start: getFutureDate(1, 15),
    tags: ["music", "nightlife"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Zimi Seh - Dancehall Party",
    description: "Weekly event every Friday from 10pm-4am. Authentic dancehall culture.",
    date_start: getFutureDate(2, 22),
    tags: ["music", "nightlife"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Xodus - Soca Night",
    description: "Weekly event every Saturday from 10pm-4am. Soca, calypso, and Caribbean beats.",
    date_start: getFutureDate(3, 22),
    tags: ["music", "nightlife", "culture"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Dolly Sundays - Brunch Party",
    description: "Weekly event every Sunday from 12pm-6pm. Bottomless drinks and Caribbean brunch.",
    date_start: getFutureDate(1, 12),
    tags: ["food", "music", "nightlife"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Uptown Mondays - Networking Mixer",
    description: "Weekly event every Monday from 6pm-10pm. Professional networking with cocktails.",
    date_start: getFutureDate(6, 18),
    tags: ["nightlife", "culture"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },

  // LOUNGES & BARS
  {
    title: "Regency - Cocktail Masterclass",
    description: "Weekly event every Wednesday from 7pm-10pm. Learn to make signature cocktails.",
    date_start: getFutureDate(4, 19),
    tags: ["food", "culture"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Di Lot Bar - Rum Tasting",
    description: "Weekly event every Friday from 6pm-10pm. Sample Jamaica's finest rums.",
    date_start: getFutureDate(2, 18),
    tags: ["food", "culture"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Raw Bar - Seafood Special",
    description: "Weekly event every Thursday from 6pm-11pm. Fresh oysters and seafood platters.",
    date_start: getFutureDate(4, 18),
    tags: ["food"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Tac Bar - Taco Tuesday",
    description: "Weekly event every Tuesday from 6pm-11pm. $2 tacos and margaritas.",
    date_start: getFutureDate(5, 18),
    tags: ["food"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Triple Century Sports Bar - Game Night",
    description: "Daily from 12pm-2am. Watch live sports with wings and beer.",
    date_start: getFutureDate(0, 12),
    tags: ["sports", "food"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Genba - Sake & Sushi",
    description: "Weekly event every Saturday from 6pm-11pm. Japanese cuisine and sake tasting.",
    date_start: getFutureDate(3, 18),
    tags: ["food", "culture"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },

  // TALKS
  {
    title: "UWI HQ - Entrepreneurship Talk",
    description: "Monthly event on first Thursday at 6pm. Learn from successful entrepreneurs.",
    date_start: getFutureDate(5, 18),
    tags: ["culture"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "FiWi Talk - Tech Innovation",
    description: "Monthly event on second Wednesday at 7pm. Tech talks and networking.",
    date_start: getFutureDate(6, 19),
    tags: ["culture"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },

  // GAMES
  {
    title: "Kingston Royale Casino - Poker Tournament",
    description: "Weekly tournament every Friday at 8pm. Texas Hold'em with cash prizes.",
    date_start: getFutureDate(2, 20),
    tags: ["games"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "E-Gaming Tournament - FIFA Championship",
    description: "Monthly tournament on last Saturday from 12pm-8pm. Compete for prizes.",
    date_start: getFutureDate(10, 12),
    tags: ["games", "sports"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },

  // SPORTS
  {
    title: "UWI Champions League - Football Match",
    description: "Weekly matches every Wednesday at 3pm. University football league.",
    date_start: getFutureDate(4, 15),
    tags: ["sports"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Red Stripe Premier League - Live Match",
    description: "Weekly matches every Sunday at 5pm. Jamaica's premier football league.",
    date_start: getFutureDate(1, 17),
    tags: ["sports"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "T20 Cricket Match",
    description: "Weekly matches every Saturday at 2pm. Fast-paced cricket action.",
    date_start: getFutureDate(3, 14),
    tags: ["sports"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Racers Grand Prix - Track & Field",
    description: "Annual event in June. World-class athletics competition.",
    date_start: getFutureDate(30, 18),
    tags: ["sports"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "MMA Fight Night",
    description: "Monthly event on third Saturday at 8pm. Mixed martial arts competition.",
    date_start: getFutureDate(12, 20),
    tags: ["sports"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },

  // NIGHTLIFE
  {
    title: "Usain Bolt's Track and Records - Live DJ",
    description: "Daily from 6pm-2am. Sports bar with live DJs and great food.",
    date_start: getFutureDate(0, 19),
    tags: ["nightlife", "music", "food"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
  {
    title: "Marketplace - Food & Music Festival",
    description: "Weekly event every Saturday from 5pm-12am. Food vendors, live music, and shopping.",
    date_start: getFutureDate(3, 17),
    tags: ["food", "music", "culture"],
    city: "Kingston",
    capacity: getRandomCapacity(),
  },
];

async function seedEvents() {
  console.log('Starting to seed events...');
  
  for (const event of events) {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select();
    
    if (error) {
      console.error(`Error inserting event "${event.title}":`, error);
    } else {
      console.log(`✓ Inserted: ${event.title}`);
    }
  }
  
  console.log('\n✅ Seeding complete!');
  console.log(`Total events seeded: ${events.length}`);
}

seedEvents();

