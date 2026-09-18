import type { WikiArticle } from "@/components/wiki/types";
import { about } from "@/content/wiki/about";
import { diary } from "@/content/wiki/diary";
import { faq } from "@/content/wiki/faq";
import { ranks } from "@/content/wiki/ranks";
import { requirements } from "@/content/wiki/requirements";

export const wikiArticles: Record<string, WikiArticle> = {
  about,
  diary,
  faq,
  ranks,
  requirements
};
