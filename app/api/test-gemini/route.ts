import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: "No API key" });
  }
  
  try {
    console.log("🔑 Making Gemini test call...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Say hello in JSON format: {\"message\": \"hello\"}" }] }],
      }),
    });
    
    console.log(`📡 Response status: ${resp.status}`);
    
    if (!resp.ok) {
      const error = await resp.json().catch(() => ({}));
      return NextResponse.json({ error: "Gemini error", details: error, status: resp.status });
    }
    
    const data = await resp.json();
    console.log("✅ Success:", data);
    
    return NextResponse.json({ success: true, response: data });
  } catch (e: any) {
    console.error("❌ Exception:", e);
    return NextResponse.json({ error: "Exception", message: e.message });
  }
}

