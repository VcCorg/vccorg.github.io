/**
 * Build-time switches. The waitlist opens only when both are set: a form that
 * posts nowhere is worse than none, and collecting emails without a contact for
 * data requests would make the privacy page untrue.
 */
export const WAITLIST_ENDPOINT = (import.meta.env.PUBLIC_WAITLIST_ENDPOINT ?? "").trim();
export const CONTACT_EMAIL = (import.meta.env.PUBLIC_CONTACT_EMAIL ?? "").trim();
export const WAITLIST_OPEN = WAITLIST_ENDPOINT !== "" && CONTACT_EMAIL !== "";
