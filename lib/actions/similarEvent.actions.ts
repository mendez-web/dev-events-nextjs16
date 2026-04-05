"use server";

import Event, { type EventListItem } from "@/database/event.model";

import connectToDatabase from "../mongodb";

export const getSimilarEventsBySlug = async (
  slug: string,
): Promise<EventListItem[]> => {
  try {
    await connectToDatabase();

    const event = await Event.findOne({ slug });
    if (!event) {
      return [];
    }

    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    })
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(similarEvents)) as EventListItem[];
  } catch {
    return [];
  }
};
