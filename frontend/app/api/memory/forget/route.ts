import { NextRequest } from "next/server";
import { memoryServiceUrl, proxyRequest } from "@/app/api/_lib/proxy";

export const dynamic = "force-dynamic";

export function POST(request: NextRequest) {
  return proxyRequest(request, memoryServiceUrl(), "/api/memory/forget");
}
