export const DASH = "—";

export function capitalise(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function isCountryCode(text: string) {
  return /^[a-z]{2}$/i.test(text);
}

export function escapeHtml(text: string) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
