import { Muted } from "@/lib/ui/typography/muted";

export function Footer() {
  return (
    <footer className="flex flex-col gap-1 px-4 py-12 text-xs lg:px-8">
      <Muted className="text-xs">
        Sanity is a player-run clan. Not affiliated with Jagex Ltd. Old School RuneScape is a trademark of Jagex Ltd.
      </Muted>
    </footer>
  );
}
