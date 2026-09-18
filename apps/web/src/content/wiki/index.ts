import type { WikiArticle } from "@/components/wiki/types.js";
import { about } from "@/content/wiki/about.js";
import { diary } from "@/content/wiki/diary.js";
import { faq } from "@/content/wiki/faq.js";
import { ranks } from "@/content/wiki/ranks.js";
import { requirements } from "@/content/wiki/requirements.js";

export const wikiArticles: Record<string, WikiArticle> = {
  about,
  diary,
  faq,
  ranks,
  requirements
};
