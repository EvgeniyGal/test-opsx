import { Storage } from "@google-cloud/storage";

let storageClient: Storage | null = null;

/**
 * Initialize Google Cloud Storage client
 * Uses environment variables for configuration
 */
function getStorageClient(): Storage {
  if (!storageClient) {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    if (!projectId) {
      throw new Error("GOOGLE_CLOUD_PROJECT_ID environment variable is not set");
    }

    storageClient = new Storage({
      projectId,
      ...(keyFilename && { keyFilename }),
    });
  }

  return storageClient;
}

/**
 * Get the storage bucket name from environment variables
 */
function getBucketName(): string {
  const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
  if (!bucketName) {
    throw new Error("GOOGLE_CLOUD_STORAGE_BUCKET environment variable is not set");
  }
  return bucketName;
}

/**
 * Upload a CV file to Google Cloud Storage
 * @param candidateId The ID of the candidate
 * @param file The file to upload (File or Buffer)
 * @returns The storage path of the uploaded file
 */
export async function uploadCV(
  candidateId: string,
  file: File | Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  try {
    const storage = getStorageClient();
    const bucket = storage.bucket(getBucketName());

    // Create a unique file path: candidates/{candidateId}/{timestamp}-{fileName}
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `candidates/${candidateId}/${timestamp}-${sanitizedFileName}`;

    const fileBuffer = file instanceof File ? await file.arrayBuffer() : file;
    const buffer = Buffer.from(fileBuffer);

    // Upload file to bucket
    const bucketFile = bucket.file(storagePath);
    await bucketFile.save(buffer, {
      metadata: {
        contentType: mimeType,
        metadata: {
          candidateId,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    return storagePath;
  } catch (error) {
    console.error("Error uploading CV to Google Cloud Storage:", error);
    throw new Error(`Failed to upload CV: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Get a signed URL for downloading a CV file
 * @param storagePath The storage path of the file
 * @param expiresIn Expiration time in seconds (default: 1 hour)
 * @returns A signed URL for downloading the file
 */
export async function getCVSignedUrl(
  storagePath: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const storage = getStorageClient();
    const bucket = storage.bucket(getBucketName());
    const file = bucket.file(storagePath);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error(`File not found: ${storagePath}`);
    }

    // Generate signed URL
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + expiresIn * 1000,
    });

    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error(`Failed to generate signed URL: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Delete a CV file from Google Cloud Storage
 * @param storagePath The storage path of the file to delete
 */
export async function deleteCV(storagePath: string): Promise<void> {
  try {
    const storage = getStorageClient();
    const bucket = storage.bucket(getBucketName());
    const file = bucket.file(storagePath);

    // Check if file exists before attempting to delete
    const [exists] = await file.exists();
    if (!exists) {
      console.warn(`File not found, skipping deletion: ${storagePath}`);
      return;
    }

    await file.delete();
  } catch (error) {
    console.error("Error deleting CV from Google Cloud Storage:", error);
    throw new Error(`Failed to delete CV: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
