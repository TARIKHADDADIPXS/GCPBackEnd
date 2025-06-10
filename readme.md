# GCP Backend Express

This project is a Node.js backend built with Express and TypeScript, designed to run on Google Cloud Platform (GCP) App Engine. It provides an API endpoint to generate signed URLs for uploading files to a Google Cloud Storage bucket.

## Project Structure

```
.
├── app.yaml                # GCP App Engine configuration
├── cloudbuild.yaml         # Google Cloud Build pipeline
├── cors.json               # CORS configuration for GCP Storage
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── .env                    # Environment variables (not committed)
├── .gitignore              # Git ignore rules
├── .gcloudignore           # GCloud ignore rules
├── .eslintrc.json          # ESLint configuration
├── .prettierrc             # Prettier configuration
├── keys/                   # Service account keys (not committed)
│   └── *.json
└── src/
    └── index.ts            # Main Express server code
```

## Features

- **Express API**: Provides a `/get-signed-url` endpoint to generate signed upload URLs for Google Cloud Storage.
- **TypeScript**: Strongly typed codebase for better maintainability.
- **CORS Support**: Configured for local development and production frontend.
- **Google Cloud Integration**: Uses App Engine and Cloud Build for deployment and CI/CD.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- Google Cloud SDK (`gcloud`)
- A GCP project with billing enabled
- A Google Cloud Storage bucket

### Setup

1. **Clone the repository**

   ```sh
   git clone <your-repo-url>
   cd gcp-backend-express
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory:

   ```
   GCP_BUCKET_NAME=<your-bucket-name>
   ```

   The bucket name is also set in `app.yaml` for production.

4. **Service Account Key**

   Place your GCP service account key JSON file in the `keys/` directory (this folder is gitignored).

5. **Run Locally**

   ```sh
   npm run build
   npm start
   ```

   Or for development with hot-reload:

   ```sh
   npm run start
   ```

   The server will start on port `4000` by default.

### API Usage

#### `POST /get-signed-url`

Request body:

```json
{
  "filename": "yourfile.txt"
}
```

Response:

```json
{
  "url": "<signed-upload-url>",
  "fileId": "inputs/<timestamp>_<random>_yourfile.txt"
}
```

- The `url` can be used to upload a file directly to GCP Storage.
- The `fileId` is the path where the file will be stored.

### Deployment

This project is configured for deployment to Google App Engine Standard Environment.

1. **Build the project**

   ```sh
   npm run build
   ```

2. **Deploy**

    **Options 1** :
    - By only pushing to the repository, this triggers a build from the Google Cloud Build Triggers.

    **Option 2** :
    - Manually deploy

   ```sh
   gcloud app deploy
   ```

   The deployment uses `app.yaml` for configuration.

### Cloud Build

- The `cloudbuild.yaml` file defines steps for CI/CD using Google Cloud Build.
- It installs dependencies, builds the project, and deploys to App Engine.

### CORS

- CORS is enabled for all origins in development.
- For production, update the `origin` in the CORS middleware in [`src/index.ts`](src/index.ts) and in [`cors.json`](cors.json) for your GCP bucket.

-To update cors for the bucket and enable multiple entries please use the folowing command assuming that you have the Google SDK installed.
```
 gsutil cors set cors.json gs://codit-test-bucket
```

### Formatting & Linting

- Run `npm run lint` to check for lint errors.
- Run `npm run format` to auto-format the codebase.

## Contributing

1. Fork the repo and create your branch.
2. Make your changes.
3. Run lint and format scripts.
4. Submit a pull request.

## License

ISC

---

For any questions, contact the project maintainer.