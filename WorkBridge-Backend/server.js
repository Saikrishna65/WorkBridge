require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const freelancerRoutes = require("./routes/freelancerRoutes");
const rateLimiter = require("./middleware/rateLimiter");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// Connect to DB
connectDB();

// Global middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(rateLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/freelancers", freelancerRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
