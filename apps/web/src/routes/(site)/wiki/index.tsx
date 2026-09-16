import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(site)/wiki/")({
  beforeLoad: () => {
    throw redirect({
      to: "/wiki/about",
      replace: true
    });
  }
});
