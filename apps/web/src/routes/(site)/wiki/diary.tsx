import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(site)/wiki/diary")({
  component: AchievementDiaryPage
});

function AchievementDiaryPage() {
  return <div className="grid h-full place-items-center text-base-content/60">Achievement Diary placeholder</div>;
}
