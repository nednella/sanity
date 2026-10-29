// OSRS treats spaces, underscores and hyphens in a name as the same character, and Wise Old Man
// reports every name with spaces. Two names that differ only there are the same account.
export function normaliseRsn(name: string) {
  return name.toLowerCase().replaceAll(/[_-]/g, " ").trim();
}
