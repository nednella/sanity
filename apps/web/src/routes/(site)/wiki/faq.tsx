import { createFileRoute } from "@tanstack/react-router";

import type { WikiArticleProps } from "@/components/wiki/wiki-article.js";
import { WikiArticle } from "@/components/wiki/wiki-article.js";

export const Route = createFileRoute("/(site)/wiki/faq")({
  component: FaqPage
});

const article: WikiArticleProps = {
  title: "FAQ",
  infobox: {
    title: "FAQ",
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
      id: "general",
      title: "General",
      content: (
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </p>
      )
    }
  ]
};

function FaqPage() {
  return <WikiArticle {...article} />;
}
