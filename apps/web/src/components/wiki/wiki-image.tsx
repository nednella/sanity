import { wikiAsideWidth } from "@/components/wiki/styles";
import { cn } from "@/lib/ui/utils";

const alignments = {
  left: `lg:float-left lg:clear-left lg:mr-6 ${wikiAsideWidth}`,
  right: `lg:float-right lg:clear-right lg:ml-6 ${wikiAsideWidth}`,
  full: "flow-root w-auto"
};

type WikiImageProps = {
  align?: keyof typeof alignments;
  alt: string;
  caption?: string;
  className?: string;
  src: string;
};

export function WikiImage({ src, alt, caption, align = "right", className }: Readonly<WikiImageProps>) {
  return (
    <figure
      className={cn("mb-4 w-full rounded-xs border border-base-300 bg-base-200 p-2", alignments[align], className)}
    >
      <img
        alt={alt}
        className="max-h-96 w-full bg-base-100 object-contain"
        loading="lazy"
        src={src}
      />
      {caption && <figcaption className="mt-2 text-center text-xs text-base-content/60">{caption}</figcaption>}
    </figure>
  );
}
