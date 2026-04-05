import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

import Event from "@/database/event.model";
import connectToDatabase from "@/lib/mongodb";

type EventPayload = {
  title: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
};

const REQUIRED_FIELDS = [
  "title",
  "description",
  "overview",
  "venue",
  "location",
  "date",
  "time",
  "mode",
  "audience",
  "organizer",
] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const normalizeStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;

    if (Array.isArray(parsed)) {
      return parsed
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  } catch {
    // Fall back to comma-separated parsing for simple form submissions.
  }

  return trimmed
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const uploadImage = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "DevEvent",
          resource_type: "image",
        },
        (error, uploadResult) => {
          if (error) {
            reject(error);
            return;
          }

          if (!uploadResult) {
            reject(new Error("Cloudinary did not return an upload result."));
            return;
          }

          resolve(uploadResult);
        },
      )
      .end(buffer);
  });

  return result.secure_url;
};

const validateRequiredFields = (
  payload: Partial<EventPayload>,
): string | null => {
  for (const field of REQUIRED_FIELDS) {
    if (!isNonEmptyString(payload[field])) {
      return field;
    }
  }

  if (!isNonEmptyString(payload.image)) {
    return "image";
  }

  if (!payload.agenda?.length) {
    return "agenda";
  }

  if (!payload.tags?.length) {
    return "tags";
  }

  return null;
};

const parseJsonPayload = async (req: NextRequest): Promise<EventPayload> => {
  const body = (await req.json()) as unknown;

  if (!isRecord(body)) {
    throw new Error("Invalid JSON payload.");
  }

  return {
    title: String(body.title ?? ""),
    description: String(body.description ?? ""),
    overview: String(body.overview ?? ""),
    image: String(body.image ?? ""),
    venue: String(body.venue ?? ""),
    location: String(body.location ?? ""),
    date: String(body.date ?? ""),
    time: String(body.time ?? ""),
    mode: String(body.mode ?? ""),
    audience: String(body.audience ?? ""),
    agenda: normalizeStringArray(body.agenda),
    organizer: String(body.organizer ?? ""),
    tags: normalizeStringArray(body.tags),
  };
};

const parseFormPayload = async (req: NextRequest): Promise<EventPayload> => {
  const formData = await req.formData();
  const imageEntry = formData.get("image");

  let image = "";

  if (imageEntry instanceof File && imageEntry.size > 0) {
    image = await uploadImage(imageEntry);
  } else if (typeof imageEntry === "string") {
    image = imageEntry.trim();
  }

  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    overview: String(formData.get("overview") ?? ""),
    image,
    venue: String(formData.get("venue") ?? ""),
    location: String(formData.get("location") ?? ""),
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
    mode: String(formData.get("mode") ?? ""),
    audience: String(formData.get("audience") ?? ""),
    // Support repeated form keys as well as single JSON/comma-separated values.
    agenda: normalizeStringArray(formData.getAll("agenda")),
    organizer: String(formData.get("organizer") ?? ""),
    tags: normalizeStringArray(formData.getAll("tags")),
  };
};

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const contentType = req.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json")
      ? await parseJsonPayload(req)
      : await parseFormPayload(req);

    const missingField = validateRequiredFields(payload);

    if (missingField) {
      return NextResponse.json(
        { message: `Missing or invalid field: ${missingField}.` },
        { status: 400 },
      );
    }

    const createdEvent = await Event.create(payload);

    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Event creation failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Events Fetched Successfully", events },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Event Fetching Failed", error: e },
      { status: 500 },
    );
  }
}
