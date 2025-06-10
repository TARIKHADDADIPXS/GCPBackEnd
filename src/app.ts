import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import storageRoutes from "./routes/storage";
import { swaggerUi, swaggerSpec } from "./swagger";

dotenv.config();

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(storageRoutes);

export default app;