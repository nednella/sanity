import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexPage
});

function IndexPage() {
  return (
    <main className="hero min-h-screen">
      <div className="hero-content flex-col text-center">
        <h1 className="text-5xl font-bold">sanity</h1>
      </div>
    </main>
  );
}
