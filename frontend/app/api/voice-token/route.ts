import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const tokenServerUrl =
    process.env.VOICE_TOKEN_SERVER_URL ?? "http://localhost:3001/api/voice-token";

  try {
    const response = await fetch(tokenServerUrl, { cache: "no-store" });
    const body = await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error("Voice token proxy failed:", error);
    return NextResponse.json(
      { error: "Voice token service unavailable" },
      { status: 502 },
    );
  }
}
