import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import CaseStudy from "./components/CaseStudy.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CaseStudy />
  </StrictMode>,
);
