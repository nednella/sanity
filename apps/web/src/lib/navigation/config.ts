import { linkOptions } from "@tanstack/react-router";

export const wikiLinks = linkOptions([
  {
    to: "/wiki/about",
    title: "About"
  },
  {
    to: "/wiki/ranks",
    title: "Ranks"
  },
  {
    to: "/wiki/requirements",
    title: "Requirements"
  },
  {
    to: "/wiki/diary",
    title: "Achievement Diary"
  },
  {
    to: "/wiki/faq",
    title: "FAQ"
  }
]);

export const navigationGroups = [
  {
    label: "Wiki",
    links: wikiLinks
  }
];
