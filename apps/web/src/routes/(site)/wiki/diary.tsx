import { createFileRoute } from "@tanstack/react-router";

import type { WikiArticleProps } from "@/components/wiki/wiki-article.js";
import { WikiArticle } from "@/components/wiki/wiki-article.js";

export const Route = createFileRoute("/(site)/wiki/diary")({
  component: AchievementDiaryPage
});

const article: WikiArticleProps = {
  title: "Achievement Diary",
  infobox: {
    title: "Achievement Diary",
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
      id: "tiers",
      title: "Tiers",
      content: (
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      )
    }
  ]
};

function AchievementDiaryPage() {
  return <WikiArticle {...article} />;
}
