
async function sendNotificationToAll(title, body, orderId, deliveryTokens) {
    await fetch("http://localhost:3000/sendNotification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            tokens: deliveryTokens,  // array of all FCM tokens
            title: title,
            body: body,
            orderId: orderId
        })
    });
}
