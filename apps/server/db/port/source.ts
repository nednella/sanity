import mysql from "mysql2/promise";

// The old database, read directly. There is no staging copy: the mapping lives
// in TypeScript, so nothing needs both databases in one query.
const sourceUrl = process.env.SOURCE_DATABASE_URL;
if (!sourceUrl) throw new Error("missing environment variable: SOURCE_DATABASE_URL");

// dateStrings keeps DATE and DATETIME as text. supportBigNumbers keeps Discord
// snowflakes exact, which a JS number cannot hold.
export const source = await mysql.createConnection({
  uri: sourceUrl,
  supportBigNumbers: true,
  bigNumberStrings: true,
  dateStrings: true
});

export const read = async <T>(table: string, orderBy?: string) => {
  const order = orderBy ? ` order by \`${orderBy}\`` : "";
  const [rows] = await source.query<mysql.RowDataPacket[]>(`select * from \`${table}\`${order}`);
  return rows as T[];
};

/**
The source stored these as DATE, so there is no time of day to invent.
*/
export const dayToUtcMidnight = (day: string | null) => (day ? new Date(`${day}T00:00:00Z`) : null);

/**
The dump was taken with TIME_ZONE='+00:00', so datetimes are already UTC.
*/
export const toUtcInstant = (value: string | null) => (value ? new Date(`${value.replace(" ", "T")}Z`) : null);

/**
 * Careful: `||` is deliberate and `??` would be wrong. An empty string is not
 * nullish, so `value?.trim() ?? null` silently stores blanks. The source uses
 * both, and the difference is real: 49 members have a null main name and 44
 * have an empty one.
 */
export const blankToNull = (value: string | null) => {
  const trimmed = value?.trim();
  return trimmed || null;
};

/**
 * bit(1) holds a raw 0 or 1, but binary(1) holds the characters "0" and "1",
 * bytes 0x30 and 0x31. Reading only the first form turns every binary(1) false.
 */
export const toBoolean = (value: Buffer | number | null) => {
  if (!Buffer.isBuffer(value)) return Boolean(value);
  return value[0] === 1 || value[0] === 0x31;
};

/**
 * Times are minutes, seconds and hundredths, and can pass an hour, so '64:52.00'
 * is 64 minutes. Postgres would read that as 64 hours, so the parts are pulled
 * apart. Two of 5683 rows separate the hundredths with a colon.
 */
export const clockToInterval = (value: string) => {
  const parts = /^(\d+):(\d+)(?:[.:](\d+))?$/.exec(value.trim());
  if (!parts) return null;
  const [, minutes, seconds, fraction = "0"] = parts;
  return `${minutes} minutes ${seconds}.${fraction} seconds`;
};
