// 📁 backend/server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const setupSocket = require("./socket");

const authRoutes = require("./routes/auth");
const freelancerRoutes = require("./routes/freelancerRoutes");
const clientRoutes = require("./routes/clientRoutes");
const projectRoutes = require("./routes/projectRoutes");
const chatRoutes = require("./routes/chatRoutes");

const rateLimiter = require("./middleware/rateLimiter");
const { errorHandler } = require("./middleware/errorMiddleware");
const suggestRouter = require("./routes/suggestFreelancerRoute");
const aiRouter = require("./routes/aiRoutes");

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // ✅ Replace with your frontend domain in prod
    methods: ["GET", "POST"],
    credentials: true,
  },
});

setupSocket(io);
app.set("io", io);

connectDB(); // Connect MongoDB

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(rateLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/freelancer", freelancerRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api", suggestRouter);
app.use("/api", aiRouter);

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
