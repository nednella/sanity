import { useQuery } from "@tanstack/react-query";
import { Swords, Users } from "lucide-react";

import { teamScale } from "@sanity/utils";

import { contentOptions } from "@/lib/api/queries/personal-bests";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/ui/select";

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
  const items = [
    {
      label: "Any content",
      value: null
    },
    ...(data ?? []).map((entry) => ({
      label: entry.name,
      value: entry.id
    }))
  ];

  function handleValueChange(value: number | null) {
    const selected = data?.find((entry) => entry.id === value);

    // A diary run at one team size only has nothing to choose, so the size
    // comes with it.
    onChange({
      contentId: selected?.id,
      scale: selected?.scales.length === 1 ? selected.scales[0] : undefined
    });
  }

  return (
    <>
      <Select
        items={items}
        onValueChange={handleValueChange}
        value={contentId ?? null}
      >
        <SelectTrigger
          aria-label="Content"
          className="w-60"
          size="sm"
        >
          <Swords />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem
              key={item.label}
              value={item.value}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
  const items = [
    {
      label: "Any scale",
      value: null
    },
    ...scales.map((option) => ({
      label: teamScale(option),
      value: option
    }))
  ];

  function handleValueChange(value: number | null) {
    onChange({
      contentId,
      scale: value ?? undefined
    });
  }

  return (
    <Select
      items={items}
      onValueChange={handleValueChange}
      value={scale ?? null}
    >
      <SelectTrigger
        aria-label="Scale"
        className="w-40"
        size="sm"
      >
        <Users />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem
            key={item.label}
            value={item.value}
          >
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
