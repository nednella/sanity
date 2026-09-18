import type { ReactNode } from "react";

type WikiInfoboxRow = {
  label: string;
  value: ReactNode;
};

type WikiInfoboxImage = {
  src: string;
  alt: string;
};

type WikiInfobox = {
  title: string;
  image?: WikiInfoboxImage;
  caption?: string;
  rows: WikiInfoboxRow[];
};

type WikiSubsection = {
  id: string;
  title: string;
  content: ReactNode;
};

type WikiSection = {
  id: string;
  title: string;
  content: ReactNode;
  subsections?: WikiSubsection[];
};

type WikiArticle = {
  title: string;
  sections: WikiSection[];
  infobox?: WikiInfobox;
};

export type { WikiArticle, WikiInfobox, WikiInfoboxImage, WikiInfoboxRow, WikiSection, WikiSubsection };
