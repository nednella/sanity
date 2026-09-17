import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(site)/members/$memberId")({
  component: MemberProfilePage
});

function MemberProfilePage() {
  return <div className="grid h-full place-items-center text-base-content/60">Member profile placeholder</div>;
}
