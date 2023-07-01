import * as Sentry from "@sentry/vue";

export default ({ app, router, store }) => {
  if(process.env.SENTRY_DSN != "YOUR_DSN") {
    Sentry.init({
        app,
        dsn: process.env.SENTRY_DSN,
        integrations: [
          new Sentry.BrowserTracing({
            // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
            routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          }),
        ],
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
      });
  }
}