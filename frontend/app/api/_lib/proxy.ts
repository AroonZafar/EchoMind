import { NextRequest, NextResponse } from "next/server";

export async function proxyRequest(
  request: NextRequest,
  baseUrl: string,
  path: string,
): Promise<NextResponse> {
  const target = `${baseUrl.replace(/\/$/, "")}${path}`;
  const headers = new Headers();
  const contentType = request.headers.get("content-type");

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.text(),
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });
    const body = await response.text();
    const upstreamType = response.headers.get("content-type") ?? "";

    if (!upstreamType.includes("json")) {
      console.error(`API proxy got non-JSON response from ${target} (HTTP ${response.status})`);
      return NextResponse.json(
        {
          error: `Backend returned a non-JSON response (HTTP ${response.status}) for ${path}. Check that the service at ${baseUrl} is running.`,
        },
        { status: response.ok ? 502 : response.status },
      );
    }

    return new NextResponse(body, {
      status: response.status,
      headers: { "Content-Type": upstreamType },
    });
  } catch (error) {
    console.error(`API proxy failed for ${path}:`, error);
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      return NextResponse.json({ error: "Backend service timed out. Please try again." }, { status: 504 });
    }
    return NextResponse.json({ error: "Backend service unavailable." }, { status: 502 });
  }
}

export function aiServiceUrl() {
  return process.env.AI_SERVICE_URL ?? "https://echomind.fastapicloud.dev";
}

export function memoryServiceUrl() {
  return process.env.MEMORY_SERVICE_URL ?? "http://127.0.0.1:8000";
}
