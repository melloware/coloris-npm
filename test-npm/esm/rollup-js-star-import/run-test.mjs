// @ts-check

import path from "path";
import { getDirname } from "../../harness/esm/helper.js";
import { loadHtml, clean, spawnYarn, requireChai, requireJsdom, waitUntil } from "../../harness/umd/helper.js";

export async function main() {
  await clean(getDirname(import.meta));

  await spawnYarn(["install"], getDirname(import.meta));
  await spawnYarn(["run", "build"], getDirname(import.meta));

  const jsdom = requireJsdom();
  const { expect } = requireChai();

  const { dom } = await loadHtml(jsdom, path.join(getDirname(import.meta), "index.html"));

  await waitUntil(() => dom.window.document.getElementById("status")?.textContent === "done", 5000);

  const picker = dom.window.document.querySelector(".clr-picker");

  expect(picker).to.not.be.null;
};