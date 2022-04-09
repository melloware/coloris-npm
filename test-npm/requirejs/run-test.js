// @ts-check

const path = require("path");
const { copyFile, loadHtml, clean, spawnYarn, requireChai, requireJsdom, removeDir, removeFile, timeout, delay, waitUntil } = require("../helper");

module.exports.main = async () => {
  const colorisSource = path.join(__dirname, "..", "..", "dist", "coloris.min.js");
  const colorisTarget = path.join(__dirname, "src", "lib", "coloris.js");

  await clean(__dirname);
  await removeFile(colorisTarget);

  await copyFile(colorisSource, colorisTarget);

  await spawnYarn(["install"], __dirname);

  const jsdom = requireJsdom();
  const { expect } = requireChai();

  const { dom } = await loadHtml(jsdom, path.join(__dirname, "index.html"));

  await waitUntil(() => dom.window.document.getElementById("status")?.textContent === "done", 5000);

  const picker = dom.window.document.querySelector(".clr-picker");

  expect(picker).to.not.be.null;
};