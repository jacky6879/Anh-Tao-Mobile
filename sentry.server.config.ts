import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.5,
    environment: process.env.NODE_ENV,
    release: process.env.SENTRY_RELEASE || "dev",
  });
}
