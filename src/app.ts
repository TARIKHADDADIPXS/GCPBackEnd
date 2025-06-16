import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import storageRoutes from "./routes/storage";
import { swaggerUi, swaggerSpec } from "./swagger";

dotenv.config();

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://frontend-dot-codit-luxembourg.ew.r.appspot.com",
    "https://frontend-dot-competition-scanner.ew.r.appspot.com",
    "https://frontend.poccactus.lu",
    "https://poccactus.lu"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-goog-resumable"]
}));
app.options('*', cors());

app.use(express.json());
app.use(storageRoutes);

export default app;