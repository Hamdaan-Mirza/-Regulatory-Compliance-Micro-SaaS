import { APIError, api } from "encore.dev/api";

interface UploadRequest {
  filename: string;
  fileBuffer: number[];
}

interface UploadResponse {
  filename: string;
  size: number;
}

export const upload = api(
  { expose: true, method: "POST", path: "/upload" },
  async (req: UploadRequest): Promise<UploadResponse> => {
    const buffer = Buffer.from(req.fileBuffer);

    if (buffer.byteLength === 0) {
      throw APIError.invalidArgument("fileBuffer", "File buffer cannot be empty.");
    }

    return {
      filename: req.filename,
      size: buffer.byteLength,
    };
  },
);
