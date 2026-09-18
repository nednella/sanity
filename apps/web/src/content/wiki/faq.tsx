import type { WikiArticle } from "@/components/wiki/types";

export const faq: WikiArticle = {
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
