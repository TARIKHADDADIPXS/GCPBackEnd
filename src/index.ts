import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Storage } from "@google-cloud/storage";

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Setup Google Cloud Storage
const bucketName = process.env.GCP_BUCKET_NAME;

if (!bucketName) {
  throw new Error("Missing required environment variables.");
}

const storage = new Storage();
const bucket = storage.bucket(bucketName);

// Route: Get Signed URL
app.post("/api/get-signed-url", async (req: Request, res: Response): Promise<any>  => {
  const { filename } = req.body;

  if (!filename || typeof filename !== "string") {
    return res.status(400).json({ error: "Filename is required and must be a string" });
  }

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
