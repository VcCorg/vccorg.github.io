interface ImportMetaEnv {
  /** Where the waitlist form posts. Empty means "not open yet". */
  readonly PUBLIC_WAITLIST_ENDPOINT?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
interface ImportMetaEnv {
  /** Where people can ask about or remove their data. Required for the form to open. */
  readonly PUBLIC_CONTACT_EMAIL?: string;
}
