import { config } from "@config";

const { webUrl } = config;

/**
 * The web client names the page to return to, so a value that does not
 * resolve to the web client's origin falls back to its root. Otherwise a link
 * to the login could send a member to any site once they login.
 *
 * see: https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html
 */
export function authRedirectUrl(redirect = "/") {
  const root = new URL(webUrl);
  const url = URL.parse(redirect, root);
  if (url?.origin !== root.origin) return root;

  return url;
}
