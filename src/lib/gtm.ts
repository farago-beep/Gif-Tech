// Google Tag Manager helpers — DataLayer events compatible GA4
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export const GTM_ID = (import.meta.env.VITE_GTM_ID as string | undefined) || "";

export const pushEvent = (event: string, payload: Record<string, unknown> = {}) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
};

// Convenience trackers
export const trackCTAClick = (cta: string, location?: string) =>
  pushEvent("cta_click", { cta_name: cta, cta_location: location });

export const trackFormSubmissionSuccess = (form: string, extra: Record<string, unknown> = {}) =>
  pushEvent("form_submission_success", { form_name: form, ...extra });

export const trackCalendlyClick = () =>
  pushEvent("calendly_click", { cta_name: "calendly_booking" });

export const trackScrollDepth = (depth: number) =>
  pushEvent("scroll_depth", { percent: depth });
