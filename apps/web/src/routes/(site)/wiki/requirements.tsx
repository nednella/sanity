import { createFileRoute } from "@tanstack/react-router";

import type { WikiArticleProps } from "@/components/wiki/wiki-article.js";
import { WikiArticle } from "@/components/wiki/wiki-article.js";

export const Route = createFileRoute("/(site)/wiki/requirements")({
  component: RequirementsPage
});

const article: WikiArticleProps = {
  title: "Requirements",
  infobox: {
    title: "Requirements",
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
      id: "how-to-join",
      title: "How to join",
      content: (
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      )
    }
  ]
};

function RequirementsPage() {
  return <WikiArticle {...article} />;
}
