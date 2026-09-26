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
    });
    const body = await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error(`API proxy failed for ${path}:`, error);
    return NextResponse.json({ error: "Backend service unavailable." }, { status: 502 });
  }
}

export function aiServiceUrl() {
  return process.env.AI_SERVICE_URL ?? "https://echomind.fastapicloud.dev";
}

export function memoryServiceUrl() {
  return process.env.MEMORY_SERVICE_URL ?? "http://127.0.0.1:8000";
}
