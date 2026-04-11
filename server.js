require('dotenv').config(); // for local .env (Render ignores this safely)

const express = require("express");
const cors = require("cors");
const path = require("path");
const twilio = require("twilio");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/static", express.static(path.join(__dirname, "static")));

// Serve main HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "index.html"));
});

// Twilio client (SAFE: uses environment variables)
const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// YES button endpoint
app.post("/send-yes", async (req, res) => {
    try {
        await client.messages.create({
            body: "She said YES 😍🔥",
            from: process.env.TWILIO_PHONE_NUMBER, // your Twilio number
            to: process.env.MY_PHONE_NUMBER         // your number
        });

        console.log("✅ SMS sent!");
        res.send("Message sent");
    } catch (error) {
        console.error("❌ Error sending SMS:", error);
        res.status(500).send("Error sending SMS");
    }
});

// Health check (useful for Render)
app.get("/health", (req, res) => {
    res.send("Server is running");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});