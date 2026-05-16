import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server);
  const PORT = 3000;

  app.use(express.json());

  // Socket.IO logic
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join-room", (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on("trade-signal", (data) => {
      // Broadcast signal to everyone in the room
      io.to(data.room).emit("new-trade", {
        ...data,
        sender: socket.id,
        timestamp: Date.now(),
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Secure API endpoint for Binance
  app.post("/api/connect-broker", async (req, res) => {
    const { apiKey, apiSecret, type } = req.body;
    // NOTE: In production, validate these using a real SDK call to the exchange
    if (!apiKey || !apiSecret) {
      return res.status(400).json({ error: "Missing credentials" });
    }
    // Simulate real connection
    res.json({ success: true, balance: 1250.50 });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
