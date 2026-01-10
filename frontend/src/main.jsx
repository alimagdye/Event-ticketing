import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App.jsx";
import { HeadProvider } from "react-head";
import AppRouter from "./Router/AppRouter.jsx";
import { AuthProvider } from "./Context/AuthProvider.jsx";
import { CategoriesProvider } from "./Context/CategoriesProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CategoriesProvider>
        <HeadProvider>
          <AppRouter>
            <App />
          </AppRouter>
        </HeadProvider>
      </CategoriesProvider>
    </AuthProvider>
  </StrictMode>
);
