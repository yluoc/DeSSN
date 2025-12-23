import { NextRequest } from "next/server";
import { apiMiddlewareHandler } from "./app/lib/middleware";

// Next.js requires middleware.ts to be at the root level
// The actual middleware logic is in app/lib/middleware.ts
export async function middleware(request: NextRequest) {
  return apiMiddlewareHandler(request);
}

export const config = {
  matcher: "/api/:path*",
};

