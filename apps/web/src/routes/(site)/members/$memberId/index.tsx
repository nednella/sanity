import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(site)/members/$memberId/")({
  component: Page
});

function Page() {
  return null;
}
