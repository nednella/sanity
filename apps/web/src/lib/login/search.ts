import { type ParsedLocation, redirect } from "@tanstack/react-router";

/**
 * The API sends a failed login back to the page it started from, with
 * `?auth=failed&error=<code>`. The error moves into the history state, so the
 * dialog shows it and the URL stays clean.
 */
export function moveLoginErrorToState(location: ParsedLocation) {
  const url = new URL(location.href, globalThis.location.origin);
  if (url.searchParams.get("auth") !== "failed") return;

  const error = url.searchParams.get("error") ?? undefined;
  url.searchParams.delete("auth");
  url.searchParams.delete("error");

  throw redirect({
    href: `${url.pathname}${url.search}${url.hash}`,
    replace: true,
    state: { login: { error } }
  });
}
