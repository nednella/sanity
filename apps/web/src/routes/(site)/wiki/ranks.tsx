import { createFileRoute } from "@tanstack/react-router";

import type { WikiArticleProps } from "@/components/wiki/wiki-article.js";
import { WikiArticle } from "@/components/wiki/wiki-article.js";

export const Route = createFileRoute("/(site)/wiki/ranks")({
  component: RanksPage
});

const article: WikiArticleProps = {
  title: "Ranks",
  infobox: {
    title: "Ranks",
    rows: [
      {
        label: "Placeholder",
        value: "Placeholder"
      },
      {
        label: "Placeholder",
        value: "Placeholder"
      }
    ]
  },
  sections: [
    {
      id: "overview",
      title: "Overview",
      content: (
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </p>
      )
    },
    {
      id: "progression",
      title: "Progression",
      content: (
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      )
    }
  ]
};

function RanksPage() {
  return <WikiArticle {...article} />;
}
