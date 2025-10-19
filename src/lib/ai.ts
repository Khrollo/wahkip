import { z } from "zod";

export const ItinerarySchema = z.object({
  morning: z.array(z.string()).max(6),
  midday: z.array(z.string()).max(6),
  afternoon: z.array(z.string()).max(6),
  evening: z.array(z.string()).max(6),
  transportNotes: z.string(),
  costEstimate: z.object({
    low: z.number().nonnegative(),
    high: z.number().nonnegative(),
    currency: z.string()
  }),
  picks: z.array(z.string()).max(12)
});
export type Itinerary = z.infer<typeof ItinerarySchema>;

export const SafetySchema = z.object({
  safetyTips: z.array(z.string()).max(12),
  priceGuidance: z.object({ guidePerDayMin: z.number(), guidePerDayMax: z.number() }),
  scamsToAvoid: z.array(z.string()).max(10)
});

// small util
export function ymd(date: string | Date) {
  const d = new Date(date);
  const pad = (n:number)=>String(n).padStart(2,"0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`;
}
