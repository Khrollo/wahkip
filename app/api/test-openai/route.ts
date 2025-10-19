import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: "No API key" });
  }
  
  try {
    console.log("🔑 Making OpenAI test call...");
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "Say hello in JSON format: {\"message\": \"hello\"}" }],
        temperature: 0.3,
      }),
    });
    
    console.log(`📡 Response status: ${resp.status}`);
    
    if (!resp.ok) {
      const error = await resp.json().catch(() => ({}));
      return NextResponse.json({ error: "OpenAI error", details: error, status: resp.status });
    }
    
    const data = await resp.json();
    console.log("✅ Success:", data);
    
    return NextResponse.json({ success: true, response: data });
  } catch (e: any) {
    console.error("❌ Exception:", e);
    return NextResponse.json({ error: "Exception", message: e.message });
  }
}

