import { z } from "zod";

// Cost estimate can be either an object or a string (for backward compatibility)
export const CostEstimateObj = z.object({
  low: z.number(),
  high: z.number(),
  currency: z.string().default("USD"),
});

export const ItinerarySchema = z.object({
  morning: z.array(z.string()),
  midday: z.array(z.string()),
  afternoon: z.array(z.string()),
  evening: z.array(z.string()),
  transportNotes: z.string(),
  costEstimate: z.union([CostEstimateObj, z.string()]),
  picks: z.array(z.string()),
});

export type Itinerary = z.infer<typeof ItinerarySchema> & {
  costEstimate: string; // Normalized to string
};

/**
 * Strip markdown code fences from a string
 */
export function stripCodeFences(s: string): string {
  return s.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
}

/**
 * Normalize itinerary costEstimate to a user-friendly string
 */
export function normalizeItinerary(itinerary: z.infer<typeof ItinerarySchema>): Itinerary {
  let costEstimateStr: string;

  if (typeof itinerary.costEstimate === "string") {
    costEstimateStr = itinerary.costEstimate;
  } else {
    const { low, high, currency } = itinerary.costEstimate;
    costEstimateStr = `$${low}-$${high} ${currency}`;
  }

  return {
    ...itinerary,
    costEstimate: costEstimateStr,
  };
}
