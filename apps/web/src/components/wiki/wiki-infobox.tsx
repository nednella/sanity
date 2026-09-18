import { wikiAsideWidth } from "@/components/wiki/styles.js";
import type { WikiInfobox } from "@/components/wiki/types.js";
import { cn } from "@/lib/ui/utils.js";

export function WikiInfobox({ title, image, caption, rows }: Readonly<WikiInfobox>) {
  return (
    <aside
      aria-label={`${title} infobox`}
      className={cn(
        "float-none mb-6 w-full overflow-hidden rounded-xs border border-base-300 bg-base-200 lg:float-right lg:mb-4 lg:ml-6",
        wikiAsideWidth
      )}
    >
      <div className="bg-neutral py-2 text-center font-semibold text-neutral-content">{title}</div>
      {image && (
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          className="mx-auto max-h-56 w-full bg-base-100 object-contain p-3"
        />
      )}
      {caption && (
        <p className="border-b border-base-300 px-3 py-2 text-center text-xs text-base-content/60">{caption}</p>
      )}
      <div className="overflow-x-auto">
        <table className="table table-sm">
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th
                  scope="row"
                  className="w-2/5 font-medium text-base-content/60"
                >
                  {row.label}
                </th>
                <td className="font-semibold">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </aside>
  );
}
