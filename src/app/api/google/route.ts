import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  // Extract token from search params
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  console.log("Token from search params:", token);

  // Process token if it exists
  if (token) {
    const cookieStore = await cookies();

    // Check if token already exists - delete it first
    if (cookieStore.has("token")) {
      cookieStore.delete("token");
    }

    // Store the new token in cookies
    cookieStore.set("token", decodeURIComponent(token), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    // Return HTML with script to close window
    return new Response(
      `
      <html>
        <head>
          <title>Authentication Successful</title>
        </head>
        <body>
          <h1>Authentication Successful</h1>
          <p>You can close this window now.</p>
          <script>
            window.onload = function() {
              // Send message to opener and close this window
              if (window.opener) {
                window.opener.postMessage('authentication-successful', '*');
                setTimeout(function() {
                  window.close();
                }, 1000);
              }
            }
          </script>
        </body>
      </html>
      `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  }

  // Redirect to homepage if no token
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
