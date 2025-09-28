chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkImpulse") {
        fetch("https://your-ai-server.com/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: request.cartItems })
        })
        .then(response => response.json())
        .then(data => {
            if (data.impulseDetected) {
                alert("⚠️ Impulse Buy Detected! Consider a cheaper alternative.");
            }
        });
    }
});
