// /server/index.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js"; // ensure you have db connection module
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));

app.use("/api/auth", authRoutes);

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
