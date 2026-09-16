import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(site)/login")({
  component: LoginPage
});

function LoginPage() {
  return <div className="grid h-full place-items-center text-base-content/60">Log in placeholder</div>;
}
