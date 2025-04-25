import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Check if we have a token parameter (coming back from OAuth)
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (token) {
    console.log("Token received in query params:", token);

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
              // Store token in client-side cookie for immediate access
              document.cookie = "token=${token}; path=/; max-age=${
        60 * 60 * 24
      }; ${
        process.env.NODE_ENV === "production" ? "secure;" : ""
      } SameSite=Strict";
              
              // Send message with token to opener window
              if (window.opener) {
                window.opener.postMessage({
                  type: 'authentication-successful',
                  token: '${token}'
                }, '*');
                
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

    // Set the cookie in the response headers (still needed for server-side)
    response.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; Max-Age=${60 * 60 * 24}; ${
        process.env.NODE_ENV === "production" ? "Secure;" : ""
      } SameSite=Strict`
    );

    return response;
  } else {
    // If no token is provided, handle the initial OAuth request
    return new Response(
      `<html><body><h1>Redirecting to Google authentication...</h1></body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Extract token from the webhook request body
    const body = await request.json().catch(() => ({}));
    console.log("Webhook request body:", body);

    const token = body.token || "";

    if (!token) {
      console.error("No token received in webhook");
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    // Create response with cookie
    const response = NextResponse.json({ success: true });

    // Set the cookie in the response
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
