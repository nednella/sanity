import { wikiLinks } from "@/lib/navigation/config.js";

type WikiArticle = (typeof wikiLinks)[number]["to"];

const wikiArticlePaths = new Set<string>(wikiLinks.map((link) => link.to));

export const defaultArticleSlug = wikiLinks[0].to.replace("/wiki/", "");

const isWikiArticle = (value: unknown): value is WikiArticle => wikiArticlePaths.has(value as string);

export const articleFromSlug = (slug: string) => {
  const article = `/wiki/${slug}`;
  if (isWikiArticle(article)) return article;
};

export type { WikiArticle };
