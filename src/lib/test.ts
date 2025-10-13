import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function verifyToken(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("❌ No Bearer token");
      return null;
    }

    const token = authHeader.slice(7);
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("❌ Missing JWT_SECRET");
      return null;
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    console.log("✅ Token payload:", payload); // <-- debug log
    return { id: payload.id as number, email: payload.email as string };
  } catch (e) {
    console.error("❌ Token verify error:", e);
    return null;
  }
}

export async function requireAuth(req: Request) {
  const user = await verifyToken(req);
  if (!user) {
    return {
      user: null,
      error: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }
  return { user, error: null };
}
