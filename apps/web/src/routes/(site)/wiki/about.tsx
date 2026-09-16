import { createFileRoute } from "@tanstack/react-router";

import type { WikiArticleProps } from "@/components/wiki/wiki-article.js";
import { WikiArticle } from "@/components/wiki/wiki-article.js";

export const Route = createFileRoute("/(site)/wiki/about")({
  component: AboutPage
});

const article: WikiArticleProps = {
  title: "Sanity",
  infobox: {
    title: "Sanity",
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
      id: "history",
      title: "History",
      content: (
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      )
    },
    {
      id: "community",
      title: "Community",
      content: (
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
      )
    }
  ]
};

function AboutPage() {
  return <WikiArticle {...article} />;
}
