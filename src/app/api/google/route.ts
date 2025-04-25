import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  // Check if we have a token parameter (coming back from OAuth)
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (token) {
    // Handle the token from the OAuth response
    console.log("Token from search params:", token);

    const cookieStore = await cookies();

    // Check if token already exists - delete it first
    if (cookieStore.has("token")) {
      cookieStore.delete("token");
    }

    const decodedToken = decodeURIComponent(token);

    // Store the new token in cookies
    cookieStore.set("token", decodedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    // Return HTML with script to close window and trigger auth check
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
  } else {
    // No token, redirect to Google OAuth
    const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_URL}/site/auth/google`;
    return NextResponse.redirect(googleAuthUrl);
  }
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
