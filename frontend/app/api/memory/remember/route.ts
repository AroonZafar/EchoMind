import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let transcript: unknown;
  try {
    transcript = (await request.json()).transcript;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (typeof transcript !== "string" || !transcript.trim()) {
    return NextResponse.json({ error: "A transcript is required." }, { status: 400 });
  }

  try {
    const base = process.env.AI_SERVICE_URL || "http://127.0.0.1:8001";
    const response = await fetch(new URL("/api/remember", base), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: transcript.trim() }),
      cache: "no-store",
    });
    const result = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: result.detail || result.error || "Could not save this memory." }, { status: response.status });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("Remember request failed:", error);
    return NextResponse.json({ error: "Could not save this memory. Check that the AI service is running." }, { status: 502 });
  }
}
