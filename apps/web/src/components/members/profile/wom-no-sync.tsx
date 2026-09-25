import { PanelEmptyMessage } from "@/components/panel";

export const WOM_NO_SYNC = "This member has not synced with Wise Old Man yet.";

export function WomNoSync() {
  return <PanelEmptyMessage>{WOM_NO_SYNC}</PanelEmptyMessage>;
}
