import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import TalkSpaceCase from "./components/TalkSpaceCase.jsx";

const container = document.getElementById("root");
const tree = (
  <StrictMode>
    <TalkSpaceCase />
  </StrictMode>
);

// See main.jsx: prerendered in the build, plain mount under the dev server.
if (import.meta.env.DEV) {
  createRoot(container).render(tree);
} else {
  hydrateRoot(container, tree);
}
