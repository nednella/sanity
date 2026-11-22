import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

export function useIsMobile() {
  return useSyncExternalStore(subscribe, isMobile);
}

function subscribe(onChange: () => void) {
  const query = globalThis.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function isMobile() {
  return globalThis.matchMedia(MOBILE_QUERY).matches;
}
