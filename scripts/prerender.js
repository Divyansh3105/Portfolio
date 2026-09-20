/**
 * Injects the build-time render of each page into its built HTML shell.
 *
 * Without this the deployed HTML is `<div id="root"></div>` and nothing else:
 * every crawler that does not execute JavaScript — link unfurlers, résumé
 * scrapers, most non-Google search bots — sees an empty page.
 *
 * Runs after both Vite builds. The client build writes the shells and the
 * hashed assets; the SSR build writes the renderer this imports.
 */
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const MARKER = '<div id="root"></div>';

const shells = {
  main: "dist/index.html",
  gravlang: "dist/gravlang/index.html",
};

const { pages } = await import(
  pathToFileURL(resolve(root, "dist-ssr/entry-server.js")).href
);

for (const [name, shell] of Object.entries(shells)) {
  const file = resolve(root, shell);
  const html = await readFile(file, "utf8");

  // A shell that no longer carries the marker means the client build changed
  // shape. Failing here is better than silently deploying an empty page.
  if (!html.includes(MARKER)) {
    throw new Error(`prerender: no ${MARKER} in ${shell}`);
  }

  const rendered = pages[name]();
  await writeFile(file, html.replace(MARKER, `<div id="root">${rendered}</div>`));
  console.log(`prerender: ${shell} +${rendered.length.toLocaleString()} chars`);
}
