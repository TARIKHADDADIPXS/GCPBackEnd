import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Storage } from "@google-cloud/storage";

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "*", // Change to your frontend URL in production
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Setup Google Cloud Storage
const bucketName = process.env.GCP_BUCKET_NAME;

if (!bucketName) {
  throw new Error("Missing required environment variables.");
}

const storage = new Storage();
const bucket = storage.bucket(bucketName);

// Route: Get Signed URL
app.post("/get-signed-url", async (req: Request, res: Response): Promise<any>  => {
  let { filename } = req.body;

  if (!filename || typeof filename !== "string") {
    return res.status(400).json({ error: "Filename is required and must be a string" });
  }

  // Generate timestamp in 'YYYY-MM-DD HH:mm:ss' format
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  // You can prepend or replace the filename as needed. Here, we prepend:
  filename = ` ${filename}_${timestamp}`;

  const file = bucket.file(filename);
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

  try {
    const [url] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires,
      contentType: "application/octet-stream",
    });
    return res.json({ url, fileId: filename });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    return res.status(500).json({ error: "Failed to generate signed URL" });
  }
});
// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
