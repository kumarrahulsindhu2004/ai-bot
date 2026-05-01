import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { handleCall } from "./handlers/callHandler.js";

const app = express();

// ✅ Health check (important for Render)
app.get("/", (req, res) => {
  res.send("🚀 Voice Agent Server Running");
});

const PORT = process.env.PORT || 3000;

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Attach WebSocket to same server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("✅ Client connected");

  ws.on("error", (err) => {
    console.error("❌ WS Error:", err.message);
  });

  ws.on("close", () => {
    console.log("🔌 Client disconnected");
  });

  handleCall(ws);
});

// ✅ Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});