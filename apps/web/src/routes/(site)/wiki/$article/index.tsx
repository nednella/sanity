import { createFileRoute, notFound } from "@tanstack/react-router";

import { WikiArticle } from "@/components/wiki/wiki-article";
import { wikiArticles } from "@/content/wiki/index";

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
