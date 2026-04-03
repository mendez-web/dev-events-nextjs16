import {
  HydratedDocument,
  Model,
  Schema,
  Types,
  model,
  models,
} from "mongoose";

import EventModel from "./event.model";

export interface Booking {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

type BookingDocument = HydratedDocument<Booking>;
type BookingModel = Model<Booking>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<Booking, BookingModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string): boolean => EMAIL_PATTERN.test(value),
        message: "Email must be a valid email address.",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Reject bookings that point to an event that does not exist.
bookingSchema.pre("save", async function (this: BookingDocument) {
  if (!this.isModified("eventId") && !this.isNew) {
    return;
  }

  const eventExists = await EventModel.exists({ _id: this.eventId });

  if (!eventExists) {
    throw new Error("Cannot create a booking for a non-existent event.");
  }
});

bookingSchema.index({ eventId: 1 });

const BookingModel =
  (models.Booking as BookingModel | undefined) ??
  model<Booking, BookingModel>("Booking", bookingSchema);

export default BookingModel;
