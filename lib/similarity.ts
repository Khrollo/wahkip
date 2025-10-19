export type TagVector = Record<string, number>;

export function tagVectorFromEvents(events: { tags: string[] }[]): TagVector {
  const vec: TagVector = {};
  events.forEach(e => {
    e.tags.forEach(tag => {
      vec[tag] = (vec[tag] || 0) + 1;
    });
  });
  return vec;
}

export function normalizeVector(vec: TagVector): TagVector {
  const magnitude = Math.sqrt(Object.values(vec).reduce((sum, v) => sum + v * v, 0));
  if (magnitude === 0) return vec;
  const normalized: TagVector = {};
  for (const [k, v] of Object.entries(vec)) {
    normalized[k] = v / magnitude;
  }
  return normalized;
}

export function cosineSim(a: TagVector, b: TagVector): number {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dot = 0;
  let magA = 0;
  let magB = 0;
  
  keys.forEach(k => {
    const av = a[k] || 0;
    const bv = b[k] || 0;
    dot += av * bv;
    magA += av * av;
    magB += bv * bv;
  });
  
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export function eventVector(event: { tags: string[] }): TagVector {
  const vec: TagVector = {};
  event.tags.forEach(tag => {
    vec[tag] = 1;
  });
  return normalizeVector(vec);
}

export function matchScore(userVec: TagVector, eventVec: TagVector): number {
  const sim = cosineSim(userVec, eventVec);
  return Math.round(Math.max(0, Math.min(100, sim * 100)));
}

