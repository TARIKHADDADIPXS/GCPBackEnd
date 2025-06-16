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
   npm run dev
   npm start
   ```

   Or for development with hot-reload:

   ```sh
   npm run dev
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
```
gsutil cors set cors.json gs://codit-bucket
```

### Formatting & Linting

- Run `npm run lint` to check for lint errors.
- Run `npm run format` to auto-format the codebase.


### CI/CD Pipeline

This project uses **Google Cloud Build** for continuous integration and deployment. The pipeline is triggered automatically whenever you push changes to the repository (if you have set up a Cloud Build trigger in your GCP project).

#### How it works

1. **Cloud Build Trigger**:  
   - A trigger is configured in Google Cloud Console to watch your repository (e.g., GitHub or Cloud Source Repositories).
   - On every push to the main branch (or any branch you specify), Cloud Build starts a new build.

2. **cloudbuild.yaml**:  
   - The build steps are defined in the `cloudbuild.yaml` file at the root of this project.
   - Typical steps include:
     - Installing dependencies (`npm install`)
     - Building the TypeScript project (`npm run build`)
     - Deploying the built app to Google App Engine (`gcloud app deploy`)

3. **App Engine Deployment**:  
   - After a successful build, Cloud Build deploys the latest code to App Engine using the configuration in `app.yaml`.
   - App Engine automatically handles scaling, logging, and serving your backend.


#### Setting up Cloud Build Trigger

1. Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers) in your GCP project.
2. Click **Create Trigger**.
3. Connect your repository and select the branch to watch.
4. Set the build configuration to use `cloudbuild.yaml`.
5. Save the trigger.

Now, every push to your repository will automatically build and deploy your backend to App Engine.


#### Manual Deployment

You can also deploy manually at any time using:

```sh
gcloud app deploy
```

### API Documentation (Swagger/OpenAPI)

This project includes interactive API documentation powered by [Swagger UI](https://swagger.io/tools/swagger-ui/).

- **View the docs locally:**  
  Start your server and open [http://localhost:4000/api-docs](http://localhost:4000/api-docs) in your browser.

- **Features:**  
  - Explore and test API endpoints directly from the browser.
  - View request/response schemas and example payloads.

#### How it works

- The Swagger UI is served at the `/api-docs` route.
- The OpenAPI specification is generated automatically from code comments and route definitions.

#### Customizing

- To update or add endpoint documentation, edit the JSDoc comments in your route files (e.g., `src/routes/storage.ts`).
- The Swagger setup is located in `src/swagger.ts`.

---

### Code and repository management

Pushing in to develop will deploy the app to Google Cloud Codit Luxembourg Playground
Pushing code to main will deploy automatically to Prod Env on client tenant

## Contributing

1. Fork the repo and create your branch.
2. Make your changes.
3. Run lint and format scripts.
4. Submit a pull request.

## License

ISC

---

For any questions, contact the project maintainer.