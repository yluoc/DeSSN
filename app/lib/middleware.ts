import { NextRequest, NextResponse } from "next/server";
import { protectWithArcjet } from "./utils/arcjet";

/**
 * Middleware handler for API route protection
 * This function contains the middleware logic and can be called from the root middleware.ts
 */
export async function apiMiddlewareHandler(request: NextRequest) {
  // Only protect API routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    // Skip protection for the arcjet test route itself to avoid recursion
    if (request.nextUrl.pathname === "/api/arcjet") {
      return NextResponse.next();
    }

    try {
      // Use the shared Arcjet protection wrapper
      const blockedResponse = await protectWithArcjet(request, 5);
      
      if (blockedResponse) {
        return blockedResponse;
      }
    } catch (error) {
      console.error("Arcjet middleware error:", error);
      // Continue with the request if Arcjet fails
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

