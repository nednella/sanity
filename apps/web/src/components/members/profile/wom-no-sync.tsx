import { PanelEmptyMessage } from "@/components/panel";

type WomNoSyncProps = {
  message: string;
};

export function WomNoSync({ message }: Readonly<WomNoSyncProps>) {
  return <PanelEmptyMessage>{message}</PanelEmptyMessage>;
}
