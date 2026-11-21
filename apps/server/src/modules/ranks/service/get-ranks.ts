import { toRank } from "@/modules/ranks/mapper";
import { listRanks } from "@/modules/ranks/repository/list-ranks";

export async function getRanks() {
  const rows = await listRanks();
  return rows.map((row) => toRank(row));
}
