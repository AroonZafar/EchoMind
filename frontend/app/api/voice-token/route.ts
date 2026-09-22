import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "ASSEMBLYAI_API_KEY is not configured" },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(
      "https://agents.assemblyai.com/v1/token?expires_in_seconds=600",
      {
        headers: { Authorization: apiKey },
        cache: "no-store",
      },
    );
    const body = await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error("AssemblyAI token request failed:", error);
    return NextResponse.json(
      { error: "AssemblyAI token service unavailable" },
      { status: 502 },
    );
  }
}
