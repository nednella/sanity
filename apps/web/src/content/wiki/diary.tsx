import type { WikiArticle } from "@/components/wiki/types.js";

export const diary: WikiArticle = {
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
