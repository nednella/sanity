import { NO_BIRTH_YEAR, formatDate } from "@sanity/utils";

// Providing your birth year is optional, and we default to 1904.
// To avoid returning ages of these members as 100+, we hide them instead.
export const OLDEST_AGE_SHOWN = 99;

export const formatBirthday = (birthday: string) => {
  const date = new Date(birthday);
  if (date.getUTCFullYear() !== NO_BIRTH_YEAR) return formatDate(birthday);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC"
  });
};
