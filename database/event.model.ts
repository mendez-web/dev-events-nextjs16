import {
  HydratedDocument,
  Model,
  Schema,
  model,
  models,
} from "mongoose";

export interface IEvent {
  title: string;
  slug: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export type EventListItem = IEvent & {
  id?: string;
  _id?: string;
};

type EventDocument = HydratedDocument<IEvent>;
type EventModel = Model<IEvent>;

const isNonEmptyString = (value: string): boolean => value.trim().length > 0;

const slugifyTitle = (title: string): string =>
  title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeDate = (value: string): string => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Event date must be a valid date.");
  }

  // Store the date as an ISO 8601 date string for predictable filtering/sorting.
  return parsed.toISOString().slice(0, 10);
};

const normalizeTime = (value: string): string => {
  const trimmed = value.trim();
  const twelveHourMatch = trimmed.match(
    /^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/
  );

  if (twelveHourMatch) {
    const [, hourText, minuteText, meridiem] = twelveHourMatch;
    const parsedHour = Number.parseInt(hourText, 10);
    const parsedMinute = Number.parseInt(minuteText, 10);

    if (
      parsedHour < 1 ||
      parsedHour > 12 ||
      parsedMinute < 0 ||
      parsedMinute > 59
    ) {
      throw new Error("Event time must be a valid time.");
    }

    const normalizedHour =
      parsedHour % 12 + (meridiem.toUpperCase() === "PM" ? 12 : 0);

    // Normalize time to 24-hour HH:mm format.
    return `${String(normalizedHour).padStart(2, "0")}:${minuteText}`;
  }

  const twentyFourHourMatch = trimmed.match(/^(\d{2}):(\d{2})$/);

  if (twentyFourHourMatch) {
    const [, hourText, minuteText] = twentyFourHourMatch;
    const parsedHour = Number.parseInt(hourText, 10);
    const parsedMinute = Number.parseInt(minuteText, 10);

    if (
      parsedHour < 0 ||
      parsedHour > 23 ||
      parsedMinute < 0 ||
      parsedMinute > 59
    ) {
      throw new Error("Event time must be a valid time.");
    }

    return `${hourText}:${minuteText}`;
  }

  throw new Error("Event time must use HH:mm or h:mm AM/PM format.");
};

const eventSchema = new Schema<IEvent, EventModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Title is required.",
      },
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Description is required.",
      },
    },
    overview: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Overview is required.",
      },
    },
    image: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Image is required.",
      },
    },
    venue: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Venue is required.",
      },
    },
    location: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Location is required.",
      },
    },
    date: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Date is required.",
      },
    },
    time: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Time is required.",
      },
    },
    mode: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Mode is required.",
      },
    },
    audience: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Audience is required.",
      },
    },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean =>
          value.length > 0 && value.every(isNonEmptyString),
        message: "Agenda must contain at least one item.",
      },
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Organizer is required.",
      },
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean =>
          value.length > 0 && value.every(isNonEmptyString),
        message: "Tags must contain at least one item.",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Keep derived fields consistent with the stored title/date/time values.
eventSchema.pre("save", function (this: EventDocument) {
  if (this.isModified("title")) {
    this.slug = slugifyTitle(this.title);

    if (!this.slug) {
      throw new Error("Slug could not be generated from the title.");
    }
  }

  if (this.isModified("date")) {
    this.date = normalizeDate(this.date);
  }

  if (this.isModified("time")) {
    this.time = normalizeTime(this.time);
  }
});

eventSchema.index({ slug: 1 }, { unique: true });

const EventModel =
  (models.Event as EventModel | undefined) ?? model<IEvent, EventModel>("Event", eventSchema);

export default EventModel;
