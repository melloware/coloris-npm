// @ts-check

import umdHelper from "../umd/helper.js";

/**
 * @param {ImportMeta} importMeta
 * @returns {string}
 */
export function getDirname(importMeta) {
  const dirUrl = new URL(".", importMeta.url);
  return dirUrl.pathname;
}

export const clean = umdHelper.clean;
export const copyFile = umdHelper.copyFile;
export const delay = umdHelper.delay;
export const existsDir = umdHelper.existsDir;
export const existsFile = umdHelper.existsFile;
export const loadHtml = umdHelper.loadHtml;
export const removeDir = umdHelper.removeDir;
export const removeFile = umdHelper.removeFile;
export const requireChai = umdHelper.requireChai;
export const requireJsdom = umdHelper.requireJsdom;
export const spawnNpm = umdHelper.spawnNpm;
export const spawnSimple = umdHelper.spawnSimple;
export const spawnYarn = umdHelper.spawnYarn;
export const timeout = umdHelper.timeout;
export const waitUntil = umdHelper.waitUntil;
