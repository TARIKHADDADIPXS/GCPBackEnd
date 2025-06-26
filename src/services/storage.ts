import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";
dotenv.config();

const bucketName = process.env.GCP_BUCKET_NAME;
if (!bucketName) throw new Error("Missing required environment variables.");

const storage = new Storage();
const bucket = storage.bucket(bucketName);

export async function generateSignedUrl(filename: string, contentType: string): Promise<{ url: string; fileId: string }> {
  // Generate timestamp and random digits
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const randomDigits = Math.floor(100 + Math.random() * 900);
  const originalFilename = filename.split('/').pop();
  const fileId = `inputs/${timestamp}_${randomDigits}_${originalFilename}`;

  const file = bucket.file(fileId);
  const expires = Date.now() + 10 * 60 * 1000;

  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires,
    contentType,
  });
  return { url, fileId };
}