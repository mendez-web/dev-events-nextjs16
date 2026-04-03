<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your DevEvent Next.js 16.2.2 App Router project. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to improve event reliability. Two client-side events are now tracked: a button click on the hero CTA and a click on each event listing card. Exception capture is enabled globally via `capture_exceptions: true`.

| Event | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicked the "Explore Events" button on the homepage hero section | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked on an event card to view event details (includes `event_id`, `event_title`, `event_slug`, `event_location`, `event_date` properties) | `components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/367462/dashboard/1427008
- **Explore Events clicks (DAU)**: https://us.posthog.com/project/367462/insights/KBGGamDY
- **Event card clicks (DAU)**: https://us.posthog.com/project/367462/insights/RhAGC53D
- **Explore → Event card conversion funnel**: https://us.posthog.com/project/367462/insights/OogqvlDu
- **Explore vs Event card clicks (side by side)**: https://us.posthog.com/project/367462/insights/bMbHFJR8

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
