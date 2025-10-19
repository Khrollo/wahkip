import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;
  
  return NextResponse.json({
    hasOpenAI,
    hasGemini,
    openAIPrefix: hasOpenAI ? process.env.OPENAI_API_KEY?.substring(0, 10) : "N/A",
    geminiPrefix: hasGemini ? process.env.GEMINI_API_KEY?.substring(0, 10) : "N/A",
  });
}

