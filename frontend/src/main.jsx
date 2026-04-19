import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import CoursesProvider from "./contexts/CoursesProvider.jsx";
import { ComparisonProvider } from "./contexts/ComparisonContext.jsx";
import { WizardProvider } from "./contexts/WizardContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CoursesProvider>
        <ComparisonProvider>
          <WizardProvider>
            <App />
          </WizardProvider>
        </ComparisonProvider>
      </CoursesProvider>
    </BrowserRouter>
  </StrictMode>
);
