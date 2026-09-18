import type { WikiArticle as WikiArticleData } from "@/components/wiki/types";
import { WikiInfobox } from "@/components/wiki/wiki-infobox";
import { WikiSection } from "@/components/wiki/wiki-section";
import { Muted } from "@/lib/ui/typography/muted";

export function WikiArticle({ title, sections, infobox }: Readonly<WikiArticleData>) {
  return (
    <article className="pt-4">
      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
      <Muted className="mt-1 text-sm italic">From the Sanity wiki</Muted>
      <hr className="mt-3 mb-6 border-base-300" />

      {infobox && <WikiInfobox {...infobox} />}

      {sections.map((section) => (
        <WikiSection
          key={section.id}
          section={section}
        />
      ))}
    </article>
  );
}
