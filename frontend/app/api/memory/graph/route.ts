import { NextResponse } from "next/server";

export async function GET() {
  try {
    const base = process.env.MEMORY_API_URL || "http://127.0.0.1:8000";
    const response = await fetch(new URL("/api/graph", base), { cache: "no-store" });
    if (!response.ok) throw new Error(`Memory API returned ${response.status}`);
    return NextResponse.json(await response.json(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Memory graph request failed:", error);
    return NextResponse.json({ error: "Could not load memories. Check that the memory server is running." }, { status: 502 });
  }
}
