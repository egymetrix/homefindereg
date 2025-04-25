import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Check if we have a token parameter (coming back from OAuth)
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  // Handle the token from the OAuth response
  console.log("Token from search params:", token);

  const decodedToken = decodeURIComponent(token || "");

  // Create response with HTML content
  const response = new Response(
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

  // Set the cookie in the response headers
  response.headers.set(
    "Set-Cookie",
    `token=${decodedToken}; Path=/; HttpOnly; Max-Age=${60 * 60 * 24}; ${
      process.env.NODE_ENV === "production" ? "Secure;" : ""
    } SameSite=Strict`
  );

  return response;
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
