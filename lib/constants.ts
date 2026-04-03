export interface Event {
  id: string;
  slug: string;
  title: string;
  image: string;
  category: "Conference" | "Summit" | "Meetup";
  location: string;
  date: string;
  endDate?: string;
  displayDate: string;
  time: string;
  description: string;
  url: string;
}

export const events: Event[] = [
  {
    id: "cityjs-london-2026",
    slug: "cityjs-london-2026",
    title: "CityJS London 2026",
    image: "/images/event1.png",
    category: "Conference",
    location: "Kensington Town Hall, London, UK",
    date: "2026-04-15",
    endDate: "2026-04-17",
    displayDate: "April 15-17, 2026",
    time: "9:00 AM",
    description:
      "A three-day JavaScript event with workshops, a community meetup, and a full conference day focused on modern frontend, tooling, and AI-powered developer workflows.",
    url: "https://london.cityjsconf.org/",
  },
  {
    id: "open-source-summit-na-2026",
    slug: "open-source-summit-na-2026",
    title: "Open Source Summit North America 2026",
    image: "/images/event2.png",
    category: "Summit",
    location: "Minneapolis, Minnesota, USA",
    date: "2026-05-18",
    endDate: "2026-05-20",
    displayDate: "May 18-20, 2026",
    time: "9:00 AM",
    description:
      "The Linux Foundation's flagship open source gathering for maintainers, developers, and community leaders covering AI, cloud, security, embedded systems, and open infrastructure.",
    url: "https://events.linuxfoundation.org/open-source-summit-north-america/",
  },
  {
    id: "siggraph-2026",
    slug: "siggraph-2026",
    title: "SIGGRAPH 2026",
    image: "/images/event3.png",
    category: "Conference",
    location: "Los Angeles Convention Center, Los Angeles, California, USA",
    date: "2026-07-19",
    endDate: "2026-07-23",
    displayDate: "July 19-23, 2026",
    time: "9:00 AM PT",
    description:
      "The flagship conference for computer graphics and interactive techniques, bringing together engineers, researchers, creative technologists, and real-time rendering teams.",
    url: "https://s2026.siggraph.org/",
  },
  {
    id: "black-hat-usa-2026",
    slug: "black-hat-usa-2026",
    title: "Black Hat USA 2026",
    image: "/images/event4.png",
    category: "Conference",
    location: "Mandalay Bay, Las Vegas, Nevada, USA",
    date: "2026-08-01",
    endDate: "2026-08-06",
    displayDate: "August 1-6, 2026",
    time: "9:00 AM PT",
    description:
      "A major security conference with hands-on trainings, briefings, demos, and deep technical research for appsec, cloud, infrastructure, and offensive security practitioners.",
    url: "https://blackhat.com/us-26/",
  },
  {
    id: "react-summit-amsterdam-2026",
    slug: "react-summit-amsterdam-2026",
    title: "React Summit 2026",
    image: "/images/event5.png",
    category: "Conference",
    location: "Amsterdam, Netherlands",
    date: "2026-06-12",
    endDate: "2026-06-16",
    displayDate: "June 12 & 16, 2026",
    time: "9:00 AM",
    description:
      "A large React ecosystem conference bringing frontend and full-stack engineers together for talks on React architecture, tooling, AI-assisted development, and production best practices.",
    url: "https://reactsummit.com/",
  },
  {
    id: "wearedevelopers-world-congress-2026",
    slug: "wearedevelopers-world-congress-2026",
    title: "WeAreDevelopers World Congress 2026",
    image: "/images/event6.png",
    category: "Conference",
    location: "Berlin, Germany",
    date: "2026-07-08",
    endDate: "2026-07-10",
    displayDate: "July 8-10, 2026",
    time: "9:00 AM",
    description:
      "A major global developer gathering with talks, workshops, and a large expo spanning software engineering, AI, cloud, DevOps, frontend, security, and developer experience.",
    url: "https://www.wearedevelopers.com/world-congress",
  },
];
