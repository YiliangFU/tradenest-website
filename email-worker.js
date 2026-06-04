addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  if (request.method !== "POST") {
    return Response.redirect("https://tradenestsourcing.com");
  }

  try {
    const data = await request.json();

    const msg = {
      personalizations: [{ to: [{ email: "rita.yang@tradenestsourcing.com" }] }],
      from: { email: "noreply@tradenestsourcing.com", name: "TradeNest Inquiry" },
      subject: "New Inquiry from " + data.name + " - " + (data.product || "General"),
      content: [{
        type: "text/plain",
        value: "New TradeNest Inquiry:\n\nName: " + data.name + "\nEmail: " + data.email + "\nCompany: " + (data.company || "N/A") + "\nProduct: " + (data.product || "N/A") + "\nQuantity: " + (data.quantity || "N/A") + "\n\nMessage:\n" + data.message
      }]
    };

    const resp = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg)
    });

    if (resp.ok) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    return new Response(JSON.stringify({ success: false, error: "Send failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
