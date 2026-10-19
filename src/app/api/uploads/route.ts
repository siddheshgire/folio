import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const uploadInitiateSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  mimeType: z.string().refine((type) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/msword",
      "application/vnd.ms-powerpoint",
      "image/png",
      "image/jpeg",
      "image/webp",
      "text/plain",
    ];
    return allowed.includes(type) || type.startsWith("image/");
  }, "Unsupported file format. Please upload PDF, DOCX, PPTX, or Image."),
  sizeBytes: z.number().max(50 * 1024 * 1024, "File size exceeds 50 MB limit"),
  sha256: z.string().length(64, "Invalid SHA-256 checksum"),
  subjectCode: z.string().optional(),
  unitName: z.string().optional(),
  groupId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = uploadInitiateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { filename, mimeType, sizeBytes, sha256 } = parsed.data;

    // Generate random secure storage key
    const uniqueId = crypto.randomUUID();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storageKey = `vault/${uniqueId}/${sanitizedFilename}`;

    // Return signed URL upload intent
    return NextResponse.json({
      success: true,
      storageKey,
      sha256,
      signedUploadUrl: `/api/storage/mock-upload/${uniqueId}`,
      expiresInSeconds: 900, // 15 minutes
      metadata: {
        filename,
        mimeType,
        sizeBytes,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error", message: err.message },
      { status: 500 }
    );
  }
}
