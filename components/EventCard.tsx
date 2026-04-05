"use client";
import Image from "next/image";
import Link from "next/link";

import type { EventListItem } from "@/database/event.model";

type Props = Pick<
  EventListItem,
  "title" | "image" | "slug" | "location" | "date" | "time" | "id"
>;

const EventCard = ({ title, image, slug, location, date, time, id }: Props) => {
  const imageSrc = image?.trim() ? image : "/images/event1.png";

  return (
    <Link href={`/events/${slug}`} id={id}>
      <Image
        src={imageSrc}
        alt={title}
        width={410}
        height={300}
        className="poster"
        unoptimized={imageSrc.startsWith("http")}
      />
      <div className="flex flex-row gap-2">
        <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
        <p>{location}</p>
      </div>
      <p className="title">{title}</p>

      <div className="datetime flex flex-row">
        <div className="flex flex-row gap-2">
          <Image
            src="/icons/calendar.svg"
            alt="datetime"
            width={14}
            height={14}
          />
          <p>{date}</p>
        </div>

        <div className="flex flex-row gap-2">
          <Image src="/icons/clock.svg" alt="datetime" width={14} height={14} />
          <p>{time}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
