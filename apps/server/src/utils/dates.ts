export const firstOfNextMonth = (from: Date) => new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 1));
