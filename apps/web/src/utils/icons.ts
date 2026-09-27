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
  return `https://chisel.weirdgloop.org/static/img/osrs-dii/${osrsItemId}.png`;
}

export function contentArtworkUrl(metric: string) {
  return `/content/${metric}.png`;
}
