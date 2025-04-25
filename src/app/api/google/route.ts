import { NextResponse } from "next/server";

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
