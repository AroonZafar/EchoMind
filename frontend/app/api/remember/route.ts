import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: { transcript?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (typeof body.transcript !== "string" || !body.transcript.trim()) {
    return NextResponse.json(
      { error: "transcript is required and cannot be empty." },
      { status: 400 },
    );
  }

  const aiServiceUrl = process.env.AI_SERVICE_URL ?? "https://echomind.fastapicloud.dev";
  const endpoint = `${aiServiceUrl.replace(/\/$/, "")}/api/remember`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: body.transcript }),
      cache: "no-store",
    });
    const responseBody = await response.text();
    const upstreamType = response.headers.get("content-type") ?? "";

    if (!upstreamType.includes("json")) {
      console.error(`Remember proxy got non-JSON response from ${endpoint} (HTTP ${response.status})`);
      return NextResponse.json(
        {
          error: `AI memory service returned a non-JSON response (HTTP ${response.status}). Check AI_SERVICE_URL (${aiServiceUrl}).`,
        },
        { status: response.ok ? 502 : response.status },
      );
    }

    return new NextResponse(responseBody, {
      status: response.status,
      headers: { "Content-Type": upstreamType },
    });
  } catch (error) {
    console.error("Remember proxy failed:", error);
    return NextResponse.json(
      { error: "AI memory service unavailable." },
      { status: 502 },
    );
  }
}
