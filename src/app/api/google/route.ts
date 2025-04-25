import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  // Extract token from search params
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  console.log("Token from search params:", token);

  // Save token in cookies if it exists
  if (token) {
    // Store the token in cookies
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
  }

  // Redirect to homepage or dashboard after setting the cookie
  return NextResponse.redirect(new URL("/", request.url));
}

export async function POST(request: Request) {
  // Extract search params from the URL
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  console.log("Token from search params:", token);

  // Log the request body
  const body = await request.json().catch(() => ({}));
  console.log("Request body:", body);

  return NextResponse.json({ message: "Request received" });
}
