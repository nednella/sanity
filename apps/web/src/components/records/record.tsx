import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { createContext, useContext, useState } from "react";

import type { RankedPersonalBest } from "@sanity/api";
import { formatTickTime, teamScale } from "@sanity/utils";

import { Medal } from "@/components/records/medal";
import { ParticipantList } from "@/components/shared/participant-list";
import { useMediaStore } from "@/lib/media/media.store";
import { screenshotAlt } from "@/lib/records/screenshot";
import { Button } from "@/lib/ui/button";
import { RelativeDate } from "@/lib/ui/relative-date";
import { H3 } from "@/lib/ui/typography/h3";
import { Overline } from "@/lib/ui/typography/overline";
import { contentArtworkUrl } from "@/utils/icons";

type Scale = {
  scale: number;
  setScale: (scale: number) => void;
};

const ScaleContext = createContext<Scale | null>(null);

type RootProps = {
  children: React.ReactNode;
  defaultScale: number;
};

export function Record({ children, defaultScale }: Readonly<RootProps>) {
  const [scale, setScale] = useState(defaultScale);

  return (
    <ScaleContext value={{ scale, setScale }}>
      <article className="relative isolate overflow-hidden border bg-background">{children}</article>
    </ScaleContext>
  );
}

function useScale() {
  const scale = useContext(ScaleContext);
  if (!scale) throw new Error("Record parts must be rendered inside a Record");

  return scale;
}

function Artwork({ metric }: Readonly<{ metric: string | null }>) {
  if (metric === null) return null;

  return (
    <img
      alt=""
      className="pointer-events-none absolute -top-4 -right-8 -z-10 h-48 object-contain opacity-15 select-none"
      src={contentArtworkUrl(metric)}
    />
  );
}

type HeaderProps = {
  children?: React.ReactNode;
  name: string;
};

function Header({ children, name }: Readonly<HeaderProps>) {
  const { scale } = useScale();

  return (
    <header className="flex items-start justify-between gap-4 border-b p-4">
      <div>
        <Overline>{teamScale(scale)}</Overline>
        <H3>{name}</H3>
      </div>

      {children && <div className="join">{children}</div>}
    </header>
  );
}

function ScaleButton({ value }: Readonly<{ value: number }>) {
  const { scale, setScale } = useScale();

  return (
    <Button
      className="join-item"
      onClick={() => setScale(value)}
      size="sm"
      variant={value === scale ? "default" : "outline"}
    >
      {value}
    </Button>
  );
}

type ListProps = {
  children: React.ReactNode;
  value: number;
};

function List({ children, value }: Readonly<ListProps>) {
  const { scale } = useScale();
  if (value !== scale) return null;

  return <ol className="divide-y divide-border">{children}</ol>;
}

function Item({ record }: Readonly<{ record: RankedPersonalBest }>) {
  const { showMedia } = useMediaStore();
  const { content, imageUrl, position, scale, submittedAt, team, timeSeconds } = record;
  const time = formatTickTime(timeSeconds);

  return (
    <li className="relative flex items-center gap-3 px-4 py-2.5 text-sm">
      {imageUrl && (
        <button
          className="
            absolute inset-0 cursor-zoom-in
            focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-primary
          "
          onClick={() => showMedia({ alt: screenshotAlt(content.name, scale, timeSeconds), src: imageUrl })}
          type="button"
        >
          <span className="sr-only">
            Screenshot of {content.name} in {time}
          </span>
        </button>
      )}

      <Medal position={position} />
      {/* Above the overlay so the links stay reachable, but only the links: the
          rest of the cell lets the click through to the screenshot. */}
      <span
        className="
          pointer-events-none relative min-w-0 flex-1 truncate
          [&_a]:pointer-events-auto
        "
      >
        <ParticipantList participants={team} />
      </span>
      <span className="w-24 shrink-0 text-right font-medium tabular-nums">{time}</span>
      <span className="w-28 shrink-0 text-right text-xs whitespace-nowrap text-muted-foreground">
        <RelativeDate value={submittedAt} />
      </span>
    </li>
  );
}

type MoreProps = {
  contentId: number;
  scale: number;
};

function More({ contentId, scale }: Readonly<MoreProps>) {
  return (
    <li>
      <Link
        className="
          flex items-center justify-center gap-1 px-4 py-2.5 text-xs text-muted-foreground
          hover:text-foreground
        "
        search={{ contentId, order: "asc", scale, sort: "time", type: "personalBests" }}
        to="/submissions"
      >
        See more
        <ChevronRight className="size-3" />
      </Link>
    </li>
  );
}

Record.Artwork = Artwork;
Record.Header = Header;
Record.Item = Item;
Record.List = List;
Record.More = More;
Record.Scale = ScaleButton;
