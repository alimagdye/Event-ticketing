import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App.jsx";
import { HeadProvider } from "react-head";
import AppRouter from "./Router/AppRouter.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeadProvider>
      <AppRouter>
        <App />
      </AppRouter>
    </HeadProvider>
  </StrictMode>
);
