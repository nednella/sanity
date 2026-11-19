export const DASH = "—";

export function capitalise(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function escapeHtml(text: string) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function isCountryCode(text: string) {
  return /^[a-z]{2}$/i.test(text);
}

export function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function pluralise(value: number, unit: string) {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}

export function titleCase(text: string) {
  return text.replaceAll(/\b\w/g, (letter) => letter.toUpperCase());
}
