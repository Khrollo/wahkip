// Deterministic demo itineraries for hackathon presentation
// These are pre-crafted, high-quality responses that showcase the platform

export const DEMO_ITINERARIES: Record<string, any> = {
  // Prompt 1: Music & Culture
  "music,culture,food": {
    morning: [
      "Start your day with Jamaican breakfast at Devon House Bakery (7:30 AM)",
      "Visit the Bob Marley Museum for a guided tour of reggae history (9:00 AM)"
    ],
    midday: [
      "Enjoy authentic jerk chicken at Scotchies (12:00 PM)",
      "Explore the National Gallery of Jamaica for local art (1:30 PM)"
    ],
    afternoon: [
      "Experience live reggae at Tuff Gong Studios (3:00 PM)",
      "Stroll through Emancipation Park and enjoy the atmosphere (4:30 PM)"
    ],
    evening: [
      "Dinner at Usain Bolt's Tracks & Records (7:00 PM)",
      "End the night with live music at Dub Club (9:00 PM)"
    ],
    transportNotes: "Use Kingston's public buses or taxis. Most venues are within 15-20 minutes of each other.",
    costEstimate: "$80-$120 USD",
    picks: ["event-1", "event-2", "event-3", "event-4"]
  },

  // Prompt 2: Food & Markets
  "food,markets,culture": {
    morning: [
      "Visit Coronation Market for fresh local produce (7:00 AM)",
      "Coffee and pastries at Café Blue (9:00 AM)"
    ],
    midday: [
      "Cooking class at Island Cooking Studio (11:00 AM)",
      "Lunch at Gloria's Restaurant for authentic Jamaican cuisine (1:00 PM)"
    ],
    afternoon: [
      "Explore Hope Botanical Gardens (2:30 PM)",
      "Sample street food at Half Way Tree Market (4:00 PM)"
    ],
    evening: [
      "Dinner at The Terra Nova All-Suite Hotel (6:30 PM)",
      "Evening stroll through New Kingston (8:00 PM)"
    ],
    transportNotes: "Markets are best reached by taxi. Walking distance between some venues in New Kingston.",
    costEstimate: "$60-$90 USD",
    picks: ["event-5", "event-6", "event-7", "event-8"]
  },

  // Prompt 3: Wellness & Nature
  "wellness,nature,relaxation": {
    morning: [
      "Sunrise yoga session at Emancipation Park (6:30 AM)",
      "Healthy breakfast at Life Yard (8:30 AM)"
    ],
    midday: [
      "Visit Blue Mountains for coffee plantation tour (10:00 AM)",
      "Lunch with mountain views at Strawberry Hill (1:00 PM)"
    ],
    afternoon: [
      "Nature walk at Holywell National Park (2:30 PM)",
      "Spa treatment at The Liguanea Club (4:00 PM)"
    ],
    evening: [
      "Meditation session at Hope Gardens (6:00 PM)",
      "Light dinner at Café Blue (7:30 PM)"
    ],
    transportNotes: "Blue Mountains requires private transport (2-hour drive). Book in advance. Kingston venues are walkable.",
    costEstimate: "$120-$180 USD",
    picks: ["event-9", "event-10", "event-11", "event-12"]
  }
};

/**
 * Get a deterministic demo itinerary based on user description
 */
export function getDemoItinerary(description: string): any {
  const desc = description.toLowerCase();
  
  // Check for key terms to match prompts
  if (desc.includes("music") || desc.includes("reggae") || desc.includes("culture")) {
    return DEMO_ITINERARIES["music,culture,food"];
  }
  
  if (desc.includes("food") || desc.includes("market") || desc.includes("cooking")) {
    return DEMO_ITINERARIES["food,markets,culture"];
  }
  
  if (desc.includes("wellness") || desc.includes("nature") || desc.includes("relax") || desc.includes("yoga")) {
    return DEMO_ITINERARIES["wellness,nature,relaxation"];
  }
  
  // Default: Music & Culture (most impressive for demo)
  return DEMO_ITINERARIES["music,culture,food"];
}


