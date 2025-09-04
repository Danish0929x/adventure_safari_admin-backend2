import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import dbConnect from "./db/dbConnect.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// CORS configuration
const corsOptions = {
  origin: true, // Allow all origins temporarily for debugging
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 5000;
dbConnect();

app.get("/", (req, res) => {
  res.send("Welcome to the Adventure_Safari_Admin_Backend");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});