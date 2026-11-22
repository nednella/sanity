import { useQuery } from "@tanstack/react-query";
import { Swords, Users } from "lucide-react";
import type { MouseEvent } from "react";

import { teamScale } from "@sanity/utils";

import { contentOptions } from "@/lib/api/queries/personal-bests";
import { Dropdown } from "@/lib/ui/dropdown";
import { closeDropdown } from "@/lib/ui/utils";

export type ContentSelection = {
  contentId: number | undefined;
  scale: number | undefined;
};

type ContentFilterProps = {
  contentId?: number;
  onChange: (selection: ContentSelection) => void;
  scale?: number;
};

export function ContentFilter({ contentId, onChange, scale }: Readonly<ContentFilterProps>) {
  const { data } = useQuery(contentOptions());
  const content = data?.find((entry) => entry.id === contentId);

  function handleSelect(selection: ContentSelection) {
    return (event: MouseEvent<HTMLElement>) => {
      closeDropdown(event);
      onChange(selection);
    };
  }

  return (
    <>
      <Dropdown
        className="w-60"
        label={
          <>
            <Swords className="size-4" />
            {content?.name ?? "Any content"}
          </>
        }
      >
        <li>
          <button
            onClick={handleSelect({ contentId: undefined, scale: undefined })}
            type="button"
          >
            Any content
          </button>
        </li>
        {data?.map((entry) => (
          <li key={entry.id}>
            <button
              // A diary run at one team size only has nothing to choose, so the
              // size comes with it.
              onClick={handleSelect({
                contentId: entry.id,
                scale: entry.scales.length === 1 ? entry.scales[0] : undefined
              })}
              type="button"
            >
              {entry.name}
            </button>
          </li>
        ))}
      </Dropdown>

      {content && content.scales.length > 1 && (
        <ScaleFilter
          contentId={content.id}
          onChange={onChange}
          scale={scale}
          scales={content.scales}
        />
      )}
    </>
  );
}

type ScaleFilterProps = {
  contentId: number;
  onChange: (selection: ContentSelection) => void;
  scale?: number;
  scales: number[];
};

function ScaleFilter({ contentId, onChange, scale, scales }: Readonly<ScaleFilterProps>) {
  function handleSelect(selected: number | undefined) {
    return (event: MouseEvent<HTMLElement>) => {
      closeDropdown(event);
      onChange({
        contentId,
        scale: selected
      });
    };
  }

  return (
    <Dropdown
      className="w-40"
      label={
        <>
          <Users className="size-4" />
          {scale === undefined ? "Any scale" : teamScale(scale)}
        </>
      }
    >
      <li>
        <button
          onClick={handleSelect(undefined)}
          type="button"
        >
          Any scale
        </button>
      </li>
      {scales.map((option) => (
        <li key={option}>
          <button
            onClick={handleSelect(option)}
            type="button"
          >
            {teamScale(option)}
          </button>
        </li>
      ))}
    </Dropdown>
  );
}
