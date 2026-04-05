"use server";

import { Booking } from "@/database";
import connectToDatabase from "../mongodb";

type CreateBookingInput = {
  eventId: string;
  email: string;
};

type CreateBookingResult =
  | {
      success: true;
      bookingId: string;
    }
  | {
      success: false;
      error: string;
    };

export const createBooking = async ({
  eventId,
  email,
}: CreateBookingInput): Promise<CreateBookingResult> => {
  try {
    const trimmedEventId = eventId.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedEventId) {
      return { success: false, error: "Missing event id." };
    }

    if (!normalizedEmail) {
      return { success: false, error: "Email is required." };
    }

    await connectToDatabase();

    const booking = await Booking.create({
      eventId: trimmedEventId,
      email: normalizedEmail,
    });

    return { success: true, bookingId: booking.id };
  } catch (e) {
    console.error("create booking failed", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Unknown booking error.",
    };
  }
};
