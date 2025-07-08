import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(new URL("/prijava", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
  response.cookies.set("access_token", "", {
    httpOnly: false,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });
  return response;
} 