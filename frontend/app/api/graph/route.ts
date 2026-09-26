import { NextRequest } from "next/server";
import { memoryServiceUrl, proxyRequest } from "@/app/api/_lib/proxy";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  return proxyRequest(request, memoryServiceUrl(), "/api/graph");
}
