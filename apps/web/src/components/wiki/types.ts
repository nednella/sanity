import type { ReactNode } from "react";

type WikiInfoboxRow = {
  label: string;
  value: ReactNode;
};

type WikiInfoboxImage = {
  alt: string;
  src: string;
};

type WikiInfobox = {
  caption?: string;
  image?: WikiInfoboxImage;
  rows: WikiInfoboxRow[];
  title: string;
};

type WikiSubsection = {
  content: ReactNode;
  id: string;
  title: string;
};

type WikiSection = {
  content: ReactNode;
  id: string;
  subsections?: WikiSubsection[];
  title: string;
};

type WikiArticle = {
  infobox?: WikiInfobox;
  sections: WikiSection[];
  title: string;
};

export type { WikiArticle, WikiInfobox, WikiInfoboxImage, WikiInfoboxRow, WikiSection, WikiSubsection };
