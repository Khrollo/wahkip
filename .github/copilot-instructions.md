<!-- Brief, project-specific guidance for AI coding assistants. Keep concise. -->
# Copilot instructions for Wahkip

Treat this repo as a Next.js 15 app (app directory) that is a small travel/event planning demo using Supabase for persistence and realtime and external LLMs for itinerary generation.

Key goals for edits
- Preserve server/client boundaries (API routes under `app/api/*` run server-side).
- Keep secrets in environment variables; server-only secrets use `SUPABASE_SERVICE_ROLE` or `OPENAI_API_KEY` and must not be leaked to the client bundle.
- Prefer minimal, well-typed changes; follow existing TypeScript + Zod patterns (see `lib/ai.ts`).

Big-picture architecture (what to know fast)
- Frontend: `app/` (Next 15 app-router) with React server components + client components under `components/` and some duplicated `src/` copies; changes should target whichever entrypoint the project uses (top-level `app/` appears primary).
- Backend: Next API route handlers live at `app/api/*`. These use the Supabase JS client and call external AI services (OpenAI / Gemini). Example: `app/api/ai/itinerary/route.ts` — builds strict JSON prompts, validates with `zod`, and falls back to deterministic output.
- Database: Supabase Postgres schema in `supabase/migrations/*.sql`. Seeds in `scripts/` use the service role key.
- Integrations: Supabase (client + service role), OpenAI (CHAT completions), and Google Generative Language (Gemini). Environment variables drive behavior (e.g., `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`, `OPENAI_API_KEY`, `GEMINI_API_KEY`).

Project-specific conventions and patterns
- Server vs client Supabase:
  - Client usage: createClient(url, anonKey) in client components (e.g., `components/EventsRealtimeClient.tsx`). Use only `NEXT_PUBLIC_*` keys.
  - Server usage: createClient(url, SUPABASE_SERVICE_ROLE) in API routes for writes (see `app/api/ai/itinerary/route.ts`). Do not expose service role to client.
- LLM usage:
  - API routes construct deterministic prompts and strictly validate/parses results with `zod` schemas defined in `lib/ai.ts` (`ItinerarySchema`, `SafetySchema`). Keep prompts terse and expect JSON parsing.
  - The code tries OpenAI first then Gemini as a fallback; implement changes that preserve this order unless adding a feature flag.
- Error handling & fallbacks:
  - Routes often have deterministic fallbacks on LLM failure (see itinerary route). If you change the schema, update the fallback shape too.
- Timeouts: LLM calls use an AbortController with TIMEOUT_MS (20s). Keep external calls cancellable.
- Typing: use zod schemas in `lib/ai.ts` and parse incoming LLM JSON with them. Follow existing simple helper utilities (e.g., `ymd` in `lib/ai.ts`).

Developer workflows (commands and env)
- Run dev server: `pnpm dev` (or `npm run dev`) — uses `next dev --turbopack` (see `package.json`).
- Build: `pnpm build` / `npm run build` (uses turbopack). Start: `pnpm start`.
- Lint: `pnpm lint`.
- Seeds: `node scripts/seed.mjs` or `node scripts/seed_jamaica.mjs` — require `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE` in `.env.local`.
- Local env example: there is a `.env.local` in the workspace with demo keys. For CI or production, ensure server-only keys are only available to server runtime.

Files worth reading to understand flow (quick map)
- `app/api/ai/itinerary/route.ts` — LLM orchestration, supabase writes, zod validation, fallback.
- `app/api/events/route.ts` — query patterns against Supabase and request handling.
- `components/EventsRealtimeClient.tsx` — client-side Supabase realtime usage; demonstrates `createClient(url, anonKey)` usage.
- `lib/ai.ts` — zod schemas that validate LLM outputs and small helpers.
- `supabase/migrations/001_base.sql` — DB layout and important column names (e.g., `events`, `itineraries`, `itinerary_requests`).
- `scripts/seed*.mjs` — how seeds use service role key for inserts; useful when adding columns or test data.

How to change code safely (rules for AI edits)
1. Never move server-only env vars to client code. If an edit requires a secret in client, propose an API route instead and wire server-side retrieval.
2. If modifying an API route that writes to Supabase, preserve use of the service role key and `.insert()` patterns; update migrations if schema changes.
3. Add or modify zod schemas whenever you change expected LLM JSON shapes and update any deterministic fallback objects to match the schema.
4. Preserve the OpenAI -> Gemini fallback and the use of AbortController timeout unless explicitly refactoring LLM orchestration.
5. Keep changes minimal and typed; prefer adding helper functions in `lib/` rather than duplicating logic across routes.

Examples to copy/paste
- Create a server supabase client in an API route (example from `app/api/ai/itinerary/route.ts`):
  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

- Parse LLM JSON with zod (from `lib/ai.ts`):
  const parsed = ItinerarySchema.parse(json);

Questions for the repo owner (if unclear)
- Which `app/` vs `src/app/` tree is canonical for future edits? I noticed duplicates under `src/`.
- Are there CI checks or custom prebuild steps not checked into repo that I should know about?

If you want this adjusted or expanded (more examples, CI, or contributor rules), tell me what to include.
