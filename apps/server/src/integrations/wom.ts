type Ranked<T> = T & { metric: string; rank: number };

export type WomPlayer = {
  id: number;
  username: string;
  displayName: string;
  type: string;
  build: string;
  exp: number;
  ehp: number;
  ehb: number;
  registeredAt: string;
  updatedAt: string | null;
};

export type WomSnapshot = {
  playerId: number;
  createdAt: string;
  data: {
    skills: Record<string, Ranked<{ experience: number; level: number; ehp: number }>>;
    bosses: Record<string, Ranked<{ kills: number; ehb: number }>>;
    activities: Record<string, Ranked<{ score: number }>>;
    computed: Record<"ehp" | "ehb", Ranked<{ value: number }>>;
  };
};

const WOM_API_URL = "https://api.wiseoldman.net/v2";
const USER_AGENT = "sanity";

const fetchWom = async <T>(path: string) => {
  const response = await fetch(`${WOM_API_URL}${path}`, { headers: { "User-Agent": USER_AGENT } });
  if (!response.ok) throw new Error(`wise old man responded ${response.status} to ${path}`);
  return (await response.json()) as T;
};

// Every group member's player and latest snapshot, in one request.
export const fetchGroupHiscores = (groupId: string) =>
  fetchWom<{ player: WomPlayer; data: WomSnapshot }[]>(`/groups/${groupId}/bulk-hiscores`);
