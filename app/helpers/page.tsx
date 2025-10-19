export const dynamic = "force-dynamic";

export default async function HelpersPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  let json = { items: [], suggestedPriceRange: { min: 40, max: 120 } };
  
  try {
    const res = await fetch(`${baseUrl}/api/helpers/search?city=Kingston`, { cache: "no-store" });
    json = await res.json();
  } catch (e) {
    console.error("Failed to fetch helpers:", e);
  }
  
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Wah Kip Helpers</h1>
      <div className="text-sm text-gray-600">
        Suggested price range: ${json?.suggestedPriceRange?.min}-${json?.suggestedPriceRange?.max}/hour
      </div>
      <ul className="grid md:grid-cols-2 gap-3">
        {(json.items || []).map((h: any) => (
          <li key={h.id} className="border rounded p-3">
            <div className="font-medium">
              {h.name} {h.verified && <span className="text-[11px] text-emerald-700">✓ verified</span>}
            </div>
            <div className="text-sm text-gray-500">{h.city} • {(h.langs || []).join(", ")}</div>
            <div className="text-sm">{(h.skills || []).join(" • ")}</div>
            <div className="text-sm">Rate: {h.rate_min ?? "?"}-{h.rate_max ?? "?"} USD</div>
            <div className="text-xs text-gray-600">
              {h.phone && <a href={`tel:${h.phone}`} className="hover:underline">Call</a>}
              {h.phone && h.whatsapp && " • "}
              {h.whatsapp && (
                <a href={`https://wa.me/${h.whatsapp.replace(/\D/g, "")}`} className="hover:underline">
                  WhatsApp
                </a>
              )}
            </div>
          </li>
        ))}
        {!json.items?.length && <li className="text-sm text-gray-500">No helpers yet.</li>}
      </ul>
    </main>
  );
}

