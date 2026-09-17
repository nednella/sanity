const iconUrl = (kind: string, metric: string) => `/icons/${kind}/${metric}.png`;

export function activityIconUrl(metric: string) {
  return iconUrl("activities", metric);
}

export function bossIconUrl(metric: string) {
  return iconUrl("bosses", metric);
}

export function skillIconUrl(metric: string) {
  return iconUrl("skills", metric);
}
