import { Router, Request, Response } from "express";
import { generateSignedUrl } from "../services/storage";

/**
 * @openapi
 * /get-signed-url:
 *   post:
 *     summary: Get a signed URL for uploading a file to Google Cloud Storage.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *                 example: "myfile.txt"
 *     responses:
 *       200:
 *         description: Signed URL generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                 fileId:
 *                   type: string
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Failed to generate signed URL.
 */
const router = Router();

router.post("/get-signed-url", async (req: Request, res: Response): Promise<any> => {
  const { filename,fileType } = req.body;
  if (!filename || typeof filename !== "string") {
    return res.status(400).json({ error: "Filename is required and must be a string" });
  }
  try {
    const { url, fileId } = await generateSignedUrl(filename, fileType);
    return res.json({ url, fileId });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    return res.status(500).json({ error: "Failed to generate signed URL" });
  }
});

export default router;