import type { ReactNode } from "react";

import { WikiInfobox } from "@/components/wiki/wiki-infobox.js";
import { WikiSection } from "@/components/wiki/wiki-section.js";
import { Muted } from "@/lib/ui/typography/muted.js";

type WikiInfoboxRow = {
  label: string;
  value: ReactNode;
};

type WikiInfoboxImage = {
  src: string;
  alt: string;
};

type WikiInfoboxData = {
  title: string;
  image?: WikiInfoboxImage;
  caption?: string;
  rows: WikiInfoboxRow[];
};

type WikiSubsectionData = {
  id: string;
  title: string;
  content: ReactNode;
};

type WikiSectionData = {
  id: string;
  title: string;
  content: ReactNode;
  subsections?: WikiSubsectionData[];
};

type WikiArticleProps = {
  title: string;
  sections: WikiSectionData[];
  infobox?: WikiInfoboxData;
};

export function WikiArticle({ title, sections, infobox }: Readonly<WikiArticleProps>) {
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

export type {
  WikiArticleProps,
  WikiInfoboxData,
  WikiInfoboxImage,
  WikiInfoboxRow,
  WikiSectionData,
  WikiSubsectionData
};
