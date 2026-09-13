import { RouterProvider } from "@tanstack/react-router";

import { AppProvider } from "@/app/providers.js";
import { router } from "@/app/router.js";

export function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
