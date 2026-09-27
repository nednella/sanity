import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Record } from "@/components/records/record";
import { recordsOptions } from "@/lib/api/queries/personal-bests";
import { toRecordGroups } from "@/lib/records/group";
import { Muted } from "@/lib/ui/typography/muted";

export const Route = createFileRoute("/(site)/records")({
  component: Page,
  loader: async ({ context }) => {
    await context.queryClient.query({ ...recordsOptions(), staleTime: "static" });
  }
});

function Page() {
  const { data } = useQuery(recordsOptions());
  const groups = toRecordGroups(data ?? []);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Records</h1>
        <Muted className="mt-1">The five fastest times the clan has recorded for each speedrun diary.</Muted>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {groups.map(({ content, scales }) => (
          <Record
            key={content.id}
            defaultScale={scales[0]!.scale}
          >
            <Record.Artwork metric={content.metric} />
            <Record.Header name={content.name}>
              {scales.length > 1 &&
                scales.map(({ scale }) => (
                  <Record.Scale
                    key={scale}
                    value={scale}
                  />
                ))}
            </Record.Header>

            {scales.map(({ records, scale }) => (
              <Record.List
                key={scale}
                value={scale}
              >
                {records.map((record) => (
                  <Record.Item
                    key={record.id}
                    record={record}
                  />
                ))}
                <Record.More
                  contentId={content.id}
                  scale={scale}
                />
              </Record.List>
            ))}
          </Record>
        ))}
      </div>
    </div>
  );
}
