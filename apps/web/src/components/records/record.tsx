import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { createContext, useContext, useMemo, useState } from "react";

import type { RankedPersonalBest } from "@sanity/api";

import { Medal } from "@/components/records/medal";
import { ParticipantList } from "@/components/shared/participant-list";
import { useMediaStore } from "@/lib/media/media.store";
import { Button } from "@/lib/ui/button";
import { RelativeDate } from "@/lib/ui/relative-date";
import { H3 } from "@/lib/ui/typography/h3";
import { Overline } from "@/lib/ui/typography/overline";
import { formatTickTime } from "@/utils/dates";
import { contentArtworkUrl } from "@/utils/icons";

type Scale = {
  scale: number;
  setScale: (scale: number) => void;
};

const ScaleContext = createContext<Scale | null>(null);

const useScale = () => {
  const scale = useContext(ScaleContext);
  if (!scale) throw new Error("Record parts must be rendered inside a Record");

  return scale;
};

type RootProps = {
  children: React.ReactNode;
  defaultScale: number;
};

export function Record({ children, defaultScale }: Readonly<RootProps>) {
  const [scale, setScale] = useState(defaultScale);
  const value = useMemo(() => ({ scale, setScale }), [scale]);

  return (
    <ScaleContext value={value}>
      <article className="relative isolate overflow-hidden rounded-xs border border-base-300 bg-base-100">
        {children}
      </article>
    </ScaleContext>
  );
}

function Artwork({ metric }: Readonly<{ metric: string | null }>) {
  if (metric === null) return null;

  return (
    <img
      src={contentArtworkUrl(metric)}
      alt=""
      className="pointer-events-none absolute -top-4 -right-8 -z-10 h-48 object-contain opacity-15 select-none"
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
    <header className="flex items-start justify-between gap-4 border-b border-base-300 p-4">
      <div>
        <Overline>{scale} man</Overline>
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
      size="sm"
      variant={value === scale ? "default" : "custom"}
      onClick={() => setScale(value)}
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

  return <ol className="divide-y divide-base-300">{children}</ol>;
}

function Item({ record }: Readonly<{ record: RankedPersonalBest }>) {
  const { showMedia } = useMediaStore();
  const { content, imageUrl, position, scale, submittedAt, team, timeSeconds } = record;
  const time = formatTickTime(timeSeconds);

  return (
    <li className="relative flex items-center gap-3 px-4 py-2.5 text-sm">
      {imageUrl && (
        <button
          type="button"
          className="absolute inset-0 cursor-zoom-in focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-primary"
          onClick={() => showMedia({ alt: `${content.name}, ${scale} man, in ${time}`, src: imageUrl })}
        >
          <span className="sr-only">
            Screenshot of {content.name} in {time}
          </span>
        </button>
      )}

      <Medal position={position} />
      {/* Above the overlay so the links stay reachable, but only the links: the rest of the cell
          lets the click through to the screenshot. */}
      <span className="pointer-events-none relative min-w-0 flex-1 truncate [&_a]:pointer-events-auto">
        <ParticipantList participants={team} />
      </span>
      <span className="w-24 shrink-0 text-right font-medium tabular-nums">{time}</span>
      <span className="w-28 shrink-0 text-right text-xs whitespace-nowrap text-base-content/50">
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
        to="/submissions"
        search={{ contentId, order: "asc", scale, sort: "time", type: "personalBests" }}
        className="flex items-center justify-center gap-1 px-4 py-2.5 text-xs text-base-content/60 hover:text-base-content"
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
