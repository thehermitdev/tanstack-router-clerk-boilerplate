import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { AppProviders } from "#/app/providers/app-providers";
import { AppRouterProvider } from "#/app/router/router-provider";

import "#/styles/globals.css";

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Root element #app was not found");
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <AppRouterProvider />
    </AppProviders>
  </StrictMode>,
);
