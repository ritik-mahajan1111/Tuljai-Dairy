import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";

import { connectDB } from "./config/database.js";
import { syncDatabase } from "./models/index.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/customers", customerRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Tuljai Dairy Backend Running Successfully 🚀",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await syncDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server Running On Port ${PORT}`);
    });
  } catch (error) {
    console.error("Server Startup Failed:", error);
  }
};

startServer();