import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { uploadCV, getCVSignedUrl, deleteCV } from "@/lib/storage";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      select: { id: true, cvStoragePath: true },
    });

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    // Get file from form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, DOC, and DOCX files are allowed." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit." },
        { status: 400 }
      );
    }

    // Delete old CV if exists
    if (candidate.cvStoragePath) {
      try {
        await deleteCV(candidate.cvStoragePath);
      } catch (error) {
        console.error("Error deleting old CV:", error);
        // Continue with upload even if deletion fails
      }
    }

    // Upload new CV
    const storagePath = await uploadCV(id, file, file.name, file.type);

    // Update candidate with CV metadata
    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: {
        cvStoragePath: storagePath,
        cvFileName: file.name,
        cvFileSize: file.size,
        cvMimeType: file.type,
        updatedBy: session.user.id,
      },
    });

    return NextResponse.json({
      message: "CV uploaded successfully",
      candidate: updatedCandidate,
    });
  } catch (error) {
    console.error("Error uploading CV:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" ? message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify candidate exists and get CV info
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      select: { id: true, cvStoragePath: true, cvFileName: true },
    });

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    if (!candidate.cvStoragePath) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    // Generate signed URL for download
    const signedUrl = await getCVSignedUrl(candidate.cvStoragePath, 3600); // 1 hour expiry

    return NextResponse.json({
      url: signedUrl,
      fileName: candidate.cvFileName,
    });
  } catch (error) {
    console.error("Error generating CV download URL:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" ? message : "Internal server error" },
      { status: 500 }
    );
  }
}
