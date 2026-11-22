import { cn } from "cn";

import { wikiAsideWidth } from "@/components/wiki/styles";
import type { WikiInfobox } from "@/components/wiki/types";

export function WikiInfobox({ title, image, caption, rows }: Readonly<WikiInfobox>) {
  return (
    <aside
      aria-label={`${title} infobox`}
      className={cn(
        `
          float-none mb-6 w-full overflow-hidden border bg-muted/50
          lg:float-right lg:mb-4 lg:ml-6
        `,
        wikiAsideWidth
      )}
    >
      <div className="bg-infobox py-2 text-center font-semibold text-infobox-foreground">{title}</div>
      {image && (
        <img
          alt={image.alt}
          className="mx-auto max-h-56 w-full bg-background object-contain p-3"
          loading="lazy"
          src={image.src}
        />
      )}
      {caption && <p className="border-b px-3 py-2 text-center text-xs text-muted-foreground">{caption}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-xs/normal">
          <tbody>
            {rows.map((row) => (
              <tr
                className="
                  border-b border-foreground/5
                  last:border-0
                "
                key={row.label}
              >
                <th
                  className="w-2/5 px-3 py-2 text-left font-medium text-muted-foreground"
                  scope="row"
                >
                  {row.label}
                </th>
                <td className="px-3 py-2 font-semibold">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </aside>
  );
}
