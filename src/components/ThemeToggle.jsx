import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "./Icons";

const META_COLOR = { light: "#F4F3F1", dark: "#0d0d0c" };

const subscribe = (notify) => {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
};
const isDark = () => document.documentElement.dataset.theme === "dark";

/**
 * Light is the default and the designed look; dark is opt-in and remembered.
 * public/theme.js applies the stored choice before first paint, so this only
 * has to follow the attribute (the server snapshot is always light, so the
 * prerendered markup matches the first client render) and flip it.
 */
export default function ThemeToggle({ className = "" }) {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", META_COLOR[next]);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage blocked: the choice still applies for this visit.
    }
  };

  const label = dark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      aria-pressed={dark}
      aria-label={label}
      title={label}
      onClick={toggle}
      className={className}
    >
      {dark ? <SunIcon size={15} /> : <MoonIcon size={15} />}
    </button>
  );
}
