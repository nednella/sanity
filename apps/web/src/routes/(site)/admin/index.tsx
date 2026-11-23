import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(site)/admin/")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/review" });
  }
});
