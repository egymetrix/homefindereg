import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Log the request body
  const body = await request.json().catch(() => ({}));
  console.log("Request body:", body);

  return NextResponse.json({ message: "Request received" });
}
