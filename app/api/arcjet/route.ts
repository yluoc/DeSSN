import { NextRequest, NextResponse } from "next/server";
import { protectWithArcjet } from "../../lib/utils/arcjet";

// GET /api/arcjet - Test endpoint for Arcjet protection
// Note: This route is excluded from middleware protection to avoid recursion
export async function GET(req: NextRequest) {
  // Use the shared Arcjet protection wrapper
  const blockedResponse = await protectWithArcjet(req, 5);
  
  if (blockedResponse) {
    return blockedResponse;
  }

  return NextResponse.json({ message: "Hello world" });
}

