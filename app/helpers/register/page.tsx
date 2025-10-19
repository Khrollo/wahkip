"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterHelperPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [city, setCity] = useState("Kingston");
  const [photoUrl, setPhotoUrl] = useState("");
  const [skills, setSkills] = useState("");
  const [langs, setLangs] = useState("en");
  const [rateMin, setRateMin] = useState("");
  const [rateMax, setRateMax] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/helpers/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          city,
          photo_url: photoUrl || null,
          skills: skills.split(",").map(s => s.trim()).filter(Boolean),
          langs: langs.split(",").map(s => s.trim()).filter(Boolean),
          rate_min: rateMin ? parseInt(rateMin) : null,
          rate_max: rateMax ? parseInt(rateMax) : null,
          phone: phone || null,
          whatsapp: whatsapp || null,
        }),
      });
      
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Registration failed");
      
      setSuccess(true);
      setTimeout(() => router.push("/helpers"), 2000);
    } catch (e: any) {
      setError(e.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="p-6 max-w-md mx-auto">
        <div className="border rounded-xl p-6 text-center space-y-3">
          <div className="text-4xl">✓</div>
          <h2 className="text-xl font-semibold">Registration Successful!</h2>
          <p className="text-sm text-gray-600">Redirecting to helpers directory...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Register as a Helper</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm font-medium">Name *</label>
          <input
            className="w-full border rounded px-3 py-2 mt-1"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">City *</label>
          <input
            className="w-full border rounded px-3 py-2 mt-1"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Photo URL (optional)</label>
          <input
            type="url"
            className="w-full border rounded px-3 py-2 mt-1"
            value={photoUrl}
            onChange={e => setPhotoUrl(e.target.value)}
            placeholder="https://example.com/photo.jpg"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Skills (comma-separated)</label>
          <input
            className="w-full border rounded px-3 py-2 mt-1"
            value={skills}
            onChange={e => setSkills(e.target.value)}
            placeholder="driver, photographer, translator"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Languages (comma-separated)</label>
          <input
            className="w-full border rounded px-3 py-2 mt-1"
            value={langs}
            onChange={e => setLangs(e.target.value)}
            placeholder="en, es, fr"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Rate Min (USD)</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 mt-1"
              value={rateMin}
              onChange={e => setRateMin(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Rate Max (USD)</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 mt-1"
              value={rateMax}
              onChange={e => setRateMax(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Phone</label>
          <input
            className="w-full border rounded px-3 py-2 mt-1"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">WhatsApp</label>
          <input
            className="w-full border rounded px-3 py-2 mt-1"
            value={whatsapp}
            onChange={e => setWhatsapp(e.target.value)}
          />
        </div>
        
        {error && <div className="text-sm text-red-600">{error}</div>}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white rounded px-4 py-2 hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </main>
  );
}

