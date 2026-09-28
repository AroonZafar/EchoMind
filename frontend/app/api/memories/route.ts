import { NextRequest } from "next/server";
import { aiServiceUrl, proxyRequest } from "@/app/api/_lib/proxy";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const query = request.nextUrl.search;
  return proxyRequest(request, aiServiceUrl(), `/api/memories${query}`);
}
