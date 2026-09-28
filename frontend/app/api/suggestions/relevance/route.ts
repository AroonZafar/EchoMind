import { NextRequest } from "next/server";
import { aiServiceUrl, proxyRequest } from "@/app/api/_lib/proxy";

export const dynamic = "force-dynamic";

export function POST(request: NextRequest) {
  return proxyRequest(request, aiServiceUrl(), "/api/check-relevance");
}
