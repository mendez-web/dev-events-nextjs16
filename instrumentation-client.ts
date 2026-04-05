import posthog from "posthog-js";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "/ingest";
const shouldEnablePosthog =
  process.env.NODE_ENV === "production" && Boolean(posthogKey);

// Keep analytics from interfering with local development when the ingest
// endpoint is unavailable or rewrites have not been applied yet.
if (shouldEnablePosthog) {
  try {
    posthog.init(posthogKey!, {
      api_host: posthogHost,
      ui_host: "https://us.posthog.com",
      defaults: "2026-01-30",
      capture_exceptions: true,
      debug: false,
    });
  } catch (error) {
    console.error("PostHog initialization failed:", error);
  }
}
