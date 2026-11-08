import { NO_BIRTH_YEAR, formatDate } from "@sanity/utils";

// Providing your birth year is optional, and we default to 1904.
// To avoid returning ages of these members as 100+, we hide them instead.
export const OLDEST_AGE_SHOWN = 99;

export const formatDayMonth = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC"
  });

export const formatBirthday = (birthday: string) =>
  new Date(birthday).getUTCFullYear() === NO_BIRTH_YEAR ? formatDayMonth(birthday) : formatDate(birthday);
