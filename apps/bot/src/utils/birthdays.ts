import { NO_BIRTH_YEAR, formatDate, formatDayMonth } from "@sanity/utils";

// Providing your birth year is optional, and we default to 1904.
// To avoid returning ages of these members as 100+, we hide them instead.
export const OLDEST_AGE_SHOWN = 99;

export function formatBirthday(birthday: string) {
  return new Date(birthday).getUTCFullYear() === NO_BIRTH_YEAR ? formatDayMonth(birthday) : formatDate(birthday);
}
