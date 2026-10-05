import { OSRS_ITEM_ICONS_URL } from "@sanity/urls";

const iconUrl = (kind: string, metric: string) => `/icons/${kind}/${metric}.png`;

export function activityIconUrl(metric: string) {
  return iconUrl("activities", metric);
}

export function diaryTierIconUrl(tier: string) {
  return iconUrl("diary", tier.toLowerCase());
}

export function bossIconUrl(metric: string) {
  return iconUrl("bosses", metric);
}

export function skillIconUrl(metric: string) {
  return iconUrl("skills", metric);
}

export function statIconUrl(stat: string) {
  return iconUrl("stats", stat);
}

export function itemIconUrl(osrsItemId: number) {
  return `${OSRS_ITEM_ICONS_URL}/${osrsItemId}.png`;
}

export function contentArtworkUrl(metric: string) {
  return `/content/${metric}.png`;
}
