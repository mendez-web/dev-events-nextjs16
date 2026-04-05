import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import EventModel, { type EventListItem } from "@/database/event.model";
import { events as fallbackEvents } from "@/lib/constants";
import connectToDatabase from "@/lib/mongodb";
import { cacheLife } from "next/cache";

const Page = async () => {
  "use cache";
  cacheLife("hours");
  let events: EventListItem[] = fallbackEvents.map((event) => ({
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    overview: event.description,
    image: event.image,
    venue: event.location,
    location: event.location,
    date: event.displayDate,
    time: event.time,
    mode: "TBA",
    audience: "Developers",
    agenda: [],
    organizer: "TBA",
    tags: [],
    createdAt: new Date(event.date),
    updatedAt: new Date(event.date),
  }));
  let eventsError: string | null = null;

  try {
    await connectToDatabase();

    const eventDocuments = await EventModel.find()
      .sort({ createdAt: -1 })
      .lean();

    events = JSON.parse(JSON.stringify(eventDocuments)) as EventListItem[];
  } catch (error) {
    console.error("Failed to load events on home page:", error);
    eventsError =
      "Live events are temporarily unavailable, so local sample events are being shown instead.";
  }

  return (
    <section>
      <h1 className="text-center ">
        The Hub for Every Dev <br /> Event You Cant Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All In One Place
      </p>
      <ExploreBtn />
      <div id="events" className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        {eventsError ? <p>{eventsError}</p> : null}
        <ul className="events">
          {events &&
            events.length > 0 &&
            events.map((event: EventListItem) => (
              <li key={event.id ?? event._id} className="list-none">
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Page;
