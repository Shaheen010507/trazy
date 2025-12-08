import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import { readFileSync } from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// Load service account key
const serviceAccount = JSON.parse(
  readFileSync("./serviceAccount.json", "utf8")
);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// ---------------------------------------------------------------
// SEND NOTIFICATION API (Owner → All Delivery Partners)
// ---------------------------------------------------------------
app.post("/sendNotification", async (req, res) => {
  try {
    const { tokens, title, body, orderId } = req.body;

    const message = {
      notification: { title, body },
      data: { orderId: orderId },
      tokens: tokens   // ⭐ list of ALL delivery boys' FCM tokens
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    res.json({
      success: true,
      msg: "Notifications sent to all delivery boys!",
      response
    });

  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ---------------------------------------------------------------
app.listen(3000, () => {
  console.log("🚀 Notification Server running on http://localhost:3000");
});
