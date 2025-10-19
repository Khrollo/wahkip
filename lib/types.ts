export type EventRow = {
  id: string;
  venue_id?: string | null;
  title: string;
  description?: string | null;
  date_start: string;
  date_end?: string | null;
  tags: string[];
  city: string;
  image_url?: string | null;
  capacity?: "low" | "medium" | "high" | null;
  created_at: string;
};

export type ItineraryJSON = {
  morning: string[]; midday: string[]; afternoon: string[]; evening: string[];
  transportNotes: string;
  costEstimate: { low: number; high: number; currency: string };
  picks: string[];
};
