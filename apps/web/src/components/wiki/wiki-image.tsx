import { wikiAsideWidth } from "@/components/wiki/styles.js";
import { cn } from "@/lib/ui/utils.js";

const alignments = {
  left: `lg:float-left lg:clear-left lg:mr-6 ${wikiAsideWidth}`,
  right: `lg:float-right lg:clear-right lg:ml-6 ${wikiAsideWidth}`,
  full: "flow-root w-auto"
};

type WikiImageProps = {
  src: string;
  alt: string;
  caption?: string;
  align?: keyof typeof alignments;
  className?: string;
};

export function WikiImage({ src, alt, caption, align = "right", className }: Readonly<WikiImageProps>) {
  return (
    <figure
      className={cn("mb-4 w-full rounded-xs border border-base-300 bg-base-200 p-2", alignments[align], className)}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="max-h-96 w-full bg-base-100 object-contain"
      />
      {caption && <figcaption className="mt-2 text-center text-xs text-base-content/60">{caption}</figcaption>}
    </figure>
  );
}
