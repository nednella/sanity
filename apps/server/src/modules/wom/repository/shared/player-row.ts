import type { PlayerResponse, SnapshotResponse } from "@wise-old-man/utils";

export const toPlayerRow = (player: PlayerResponse, snapshot: SnapshotResponse | null) => ({
  womPlayerId: player.id,
  username: player.username,
  displayName: player.displayName,
  type: player.type,
  build: player.build,
  status: player.status,
  totalLevel: snapshot?.data.skills.overall.level ?? null,
  totalExp: player.exp,
  totalEhp: player.ehp,
  totalEhb: player.ehb,
  timeToMax: player.ttm,
  timeTo200m: player.tt200m,
  registeredAt: player.registeredAt,
  updatedAt: player.updatedAt,
  lastChangedAt: player.lastChangedAt,
  syncedAt: new Date()
});
