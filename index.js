import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { dbconnection } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cookieParser())
app.use(cors())

// Routes
app.get("/", (req, res) => {
  res.send("Backend running using ES6 import/export!");
});

dbconnection()
// Start Server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
