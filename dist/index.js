"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const storage_1 = require("@google-cloud/storage");
// Load env vars
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: "*", // Change to your frontend URL in production
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express_1.default.json());
app.options("*", (0, cors_1.default)());
// Setup Google Cloud Storage
const bucketName = process.env.GCP_BUCKET_NAME;
if (!bucketName) {
    throw new Error("Missing required environment variables.");
}
const storage = new storage_1.Storage();
const bucket = storage.bucket(bucketName);
// Route: Get Signed URL
app.post("/api/get-signed-url", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename } = req.body;
    if (!filename || typeof filename !== "string") {
        return res.status(400).json({ error: "Filename is required and must be a string" });
    }
    const file = bucket.file(filename);
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    try {
        const [url] = yield file.getSignedUrl({
            version: "v4",
            action: "write",
            expires,
            contentType: "application/octet-stream",
        });
        return res.json({ url, fileId: filename });
    }
    catch (err) {
        console.error("Error generating signed URL:", err);
        return res.status(500).json({ error: "Failed to generate signed URL" });
    }
}));
// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
});
