// OSRS treats spaces, underscores and hyphens in a name as the same character, and Wise Old Man
// reports every name with spaces. Two names that differ only there are the same account.
export const normaliseRsn = (name: string) => name.toLowerCase().replaceAll(/[_-]/g, " ").trim();
