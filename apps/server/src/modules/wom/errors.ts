import { ApplicationError } from "@/errors/error";

/**
 * Wise Old Man refuses a player it updated in the last minute, one the hiscores don't return data
 * for, or one who opted out of being tracked. Its status code says which.
 */
const REFUSALS = {
  400: { code: "WOM_NOT_ON_HISCORES", message: "That RSN isn't on the hiscores." },
  403: { code: "WOM_UPDATE_REFUSED", message: "Wise Old Man can't update this player." },
  404: { code: "WOM_PLAYER_NOT_FOUND", message: "Wise Old Man has no record of that RSN." },
  429: { code: "WOM_UPDATED_RECENTLY", message: "Updated less than a minute ago, try again shortly." }
} as const;

const isRefusal = (status: number | undefined): status is keyof typeof REFUSALS =>
  status !== undefined && Object.hasOwn(REFUSALS, status);

const fromRefusal = (error: unknown) => {
  const { statusCode } = error as { statusCode?: number };
  if (!isRefusal(statusCode)) return error;

  const { code, message } = REFUSALS[statusCode];
  return new ApplicationError(code, statusCode, message);
};

export const womErrors = {
  fromRefusal,
  notTracked: (username: string) =>
    new ApplicationError("WOM_PLAYER_NOT_TRACKED", 404, `RSN ${username} is not tracked by Sanity.`)
};
