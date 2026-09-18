import { createFileRoute, notFound } from "@tanstack/react-router";

import { WikiArticle } from "@/components/wiki/wiki-article.js";
import { wikiArticles } from "@/content/wiki/index.js";

export const Route = createFileRoute("/(site)/wiki/$article/")({
  component: WikiArticlePage,
  loader: ({ params }) => {
    const article = wikiArticles[params.article];
    if (!article) throw notFound();
    return article;
  }
});

function WikiArticlePage() {
  const article = Route.useLoaderData();

  return <WikiArticle {...article} />;
}
