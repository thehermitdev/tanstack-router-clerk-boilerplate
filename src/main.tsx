import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { queryClient } from "#/app/query-client/query-client";
import { getRouter } from "#/app/router/router";
import { ThemeProvider } from "#/shared/theme/theme-provider";

import "#/styles/globals.css";

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Root element #app was not found");
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider
      defaultTheme="system"
      storageKey="tanstack-router-boilerplate-theme"
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={getRouter()} />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
