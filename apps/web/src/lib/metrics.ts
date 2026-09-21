import { MetricProps, isMetric } from "@wise-old-man/utils";

/**
 * Map the snake_case metric key into the formatted display name using Wise Old Man's MetricProps.
 * We use the raw key as a fallback so any new entries still read without a package version bump.
 */
export const metricName = (metric: string) => (isMetric(metric) ? MetricProps[metric].name : metric);
