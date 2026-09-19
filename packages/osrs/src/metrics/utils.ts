import { METRICS, type Metric } from "./enum.js";

const isMetric = (value: string): value is Metric => Object.hasOwn(METRICS, value);

// Fallback to the key for unknown metrics, so new changes from Wise Old Man are still readable.
export const metricName = (metric: string) => (isMetric(metric) ? METRICS[metric] : metric);
