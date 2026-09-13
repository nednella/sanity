import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <main className="hero min-h-screen">
      <div className="hero-content flex-col text-center">
        <h1 className="text-5xl font-bold">Page not found</h1>
        <Link
          to="/"
          className="btn btn-primary"
        >
          Go back home
        </Link>
      </div>
    </main>
  );
}
