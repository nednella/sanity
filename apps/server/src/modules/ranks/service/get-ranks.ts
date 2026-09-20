import { toRank } from "../mapper";
import { listRanks } from "../repository/list-ranks";

export const getRanks = async () => {
  const rows = await listRanks();
  return rows.map((row) => toRank(row));
};
