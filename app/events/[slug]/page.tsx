import BookEvent from "@/components/BookEvent";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getSimilarEventsBySlug } from "@/lib/actions/similarEvent.actions";
import { EventListItem } from "@/database/event.model";
import EventCard from "@/components/EventCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

type EventDetailsResponse = {
  event?: EventListItem;
};

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className=" flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>
        {tag}
      </div>
    ))}
  </div>
);
const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((agenda) => (
        <li key={agenda}>{agenda}</li>
      ))}
    </ul>
  </div>
);

const EventDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  if (!BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_BASE_URL.");
  }

  const request = await fetch(`${BASE_URL}/api/events/${slug}`);

  if (request.status === 404) {
    notFound();
  }

  if (!request.ok) {
    throw new Error("Failed to fetch event details.");
  }

  const { event } = (await request.json()) as EventDetailsResponse;

  if (!event) {
    notFound();
  }

  const {
    description,
    image,
    overview,
    date,
    time,
    mode,
    location,
    agenda,
    audience,
    tags,
    organizer,
  } = event;

  const bookings = 10;

  const similarEvents: EventListItem[] = await getSimilarEventsBySlug(slug);
  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p className="mt-2">{description}</p>
      </div>
      <div className="details">
        {/* leftside */}
        <div className="content">
          <Image
            src={image}
            alt="event-banner"
            width={800}
            height={800}
            className="banner"
          />
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={date}
            />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />
          </section>
          <EventAgenda agendaItems={agenda} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>
          <EventTags tags={tags} />
        </div>
        {/* rightside */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot</p>
            )}
            <BookEvent />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 &&
            similarEvents.map((similarEvent: EventListItem) => (
              <EventCard key={similarEvent.id} {...similarEvent} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
