import { toRank } from "../mapper";
import { listRanks } from "../repository/list-ranks";

export async function getRanks() {
  const rows = await listRanks();
  return rows.map((row) => toRank(row));
}
