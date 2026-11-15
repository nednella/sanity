import { useQuery } from "@tanstack/react-query";
import { Swords, Users } from "lucide-react";
import type { MouseEvent } from "react";

import { teamScale } from "@sanity/utils";

import { contentOptions } from "@/lib/api/queries/personal-bests";
import { Dropdown } from "@/lib/ui/dropdown";

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

  function pick(selection: ContentSelection) {
    return (event: MouseEvent<HTMLElement>) => {
      close(event);
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
            onClick={pick({ contentId: undefined, scale: undefined })}
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
              onClick={pick({ contentId: entry.id, scale: entry.scales.length === 1 ? entry.scales[0] : undefined })}
              type="button"
            >
              {entry.name}
            </button>
          </li>
        ))}
      </Dropdown>

      {content && content.scales.length > 1 && (
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
              onClick={pick({ contentId: content.id, scale: undefined })}
              type="button"
            >
              Any scale
            </button>
          </li>
          {content.scales.map((option) => (
            <li key={option}>
              <button
                onClick={pick({ contentId: content.id, scale: option })}
                type="button"
              >
                {teamScale(option)}
              </button>
            </li>
          ))}
        </Dropdown>
      )}
    </>
  );
}

// A menu item is not a form control, so picking one has to dismiss the popover
// it sits in.
function close(event: MouseEvent<HTMLElement>) {
  event.currentTarget.closest<HTMLElement>("[popover]")?.hidePopover();
}
