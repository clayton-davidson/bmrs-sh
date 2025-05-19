export async function GET() {
  try {
    const response = await fetch("http://nsb-beammillapi/api/sse/home-events", {
      method: "GET",
      headers: {
        Accept: "text/event-stream",
      },
    });

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("SSE error:", error);
    return new Response("Error establishing SSE connection", { status: 500 });
  }
}
