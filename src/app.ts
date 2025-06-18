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

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-goog-resumable");
    res.sendStatus(204); // No Content
  } else {
    next();
  }
});


app.use(express.json());
app.use(storageRoutes);

export default app;