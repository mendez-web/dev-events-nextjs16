import { NextResponse } from "next/server";

import EventModel, { type EventListItem } from "@/database/event.model";
import connectToDatabase from "@/lib/mongodb";

type RouteParams = {
  slug: string;
};

type ErrorResponse = {
  message: string;
};

type SuccessResponse = {
  message: string;
  event: EventListItem;
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const jsonError = (message: string, status: number) =>
  NextResponse.json<ErrorResponse>({ message }, { status });

const normalizeSlug = (value: string): string => value.trim().toLowerCase();

const isValidSlug = (value: string): boolean => SLUG_PATTERN.test(value);

export async function GET(
  _request: Request,
  { params }: { params: Promise<RouteParams> },
) {
  try {
    const { slug } = await params;
    const normalizedSlug = normalizeSlug(slug);

    // Reject empty or malformed slugs before hitting the database.
    if (!normalizedSlug) {
      return jsonError("Missing event slug.", 400);
    }

    if (!isValidSlug(normalizedSlug)) {
      return jsonError(
        "Invalid event slug. Use lowercase letters, numbers, and hyphens only.",
        400,
      );
    }

    await connectToDatabase();

    // Query a single event by its unique slug and serialize it for JSON output.
    const eventDocument = await EventModel.findOne({ slug: normalizedSlug })
      .lean()
      .exec();

    if (!eventDocument) {
      return jsonError("Event not found.", 404);
    }

    const event = JSON.parse(JSON.stringify(eventDocument)) as EventListItem;

    return NextResponse.json<SuccessResponse>(
      {
        message: "Event fetched successfully.",
        event,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to fetch event by slug:", error);

    return jsonError(
      "An unexpected error occurred while fetching the event.",
      500,
    );
  }
}
