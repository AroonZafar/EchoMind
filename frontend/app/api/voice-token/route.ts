import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ASSEMBLYAI_API_KEY is missing from the frontend server environment." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch("https://agents.assemblyai.com/v1/token?expires_in_seconds=600", {
      headers: {
        Authorization: apiKey,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: `AssemblyAI token request failed (HTTP ${response.status}).` },
        { status: 502 },
      );
    }
    const data = await response.json();
    if (typeof data.token !== "string" || !data.token) {
      return NextResponse.json({ error: "AssemblyAI returned no voice token." }, { status: 502 });
    }
    return NextResponse.json({ token: data.token }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Voice token request failed:", error instanceof Error ? error.name : "Unknown error");
    return NextResponse.json(
      { error: "Voice token service unavailable" },
      { status: 502 },
    );
  }
}
