import { cn } from "cn";

import { wikiAsideWidth } from "@/components/wiki/styles";

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
    <figure className={cn("mb-4 w-full border bg-muted/50 p-2", alignments[align], className)}>
      <img
        alt={alt}
        className="max-h-96 w-full bg-background object-contain"
        loading="lazy"
        src={src}
      />
      {caption && <figcaption className="mt-2 text-center text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}
