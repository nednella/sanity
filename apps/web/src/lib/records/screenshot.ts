import { formatTickTime, teamScale } from "@sanity/utils";

export function screenshotAlt(contentName: string, scale: number, timeSeconds: number) {
  return `${contentName}, ${teamScale(scale)}, in ${formatTickTime(timeSeconds)}`;
}
