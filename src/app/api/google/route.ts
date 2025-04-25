import { NextResponse } from "next/server";

export async function GET() {
  // This route now handles the final step of authentication process
  // It shows a success page that will message the opener window

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
