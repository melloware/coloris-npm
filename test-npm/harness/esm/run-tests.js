// @ts-check

import fs from "fs";
import { createRequire } from "module";
import path from "path";

import { spawnNpm, existsDir, getDirname } from "./helper.js";

/**
 * @typedef {{success: true, path: string}} Success
 */
undefined;

/**
* @typedef {{success: false, path: string, error: Error}} Failure
*/
undefined;

/**
 * @typedef {Success | Failure} TestResult
 */
undefined;

/**
 * @param {string} base 
 * @returns {Promise<string[]>} 
 */
async function readTests(base) {
  const dirs = await fs.promises.readdir(base);
  /** @type {string[]} */
  const tests = [];
  for (const name of dirs) {
    const dir = path.join(base, name);
    if (await existsDir(dir) && name !== "helper") {
      tests.push(dir);
    }
  }
  return tests;
}

/**
 * @param {string} base 
 * @returns {Promise<string[]>} 
 */
async function readAvailableTests(base) {
  const tests = [
    ...await readTests(path.join(base, "esm")),
    ...await readTests(path.join(base, "umd")),
    ...await readTests(path.join(base, "ts")),
  ];
  return tests.map(test => path.relative(base, test));
}

/**
 * @param {string} path 
 */
async function runTestScript(path) {
  if (path.endsWith(".js")) {
    console.log(`Loading test script ${path} via required...`);
    const test = createRequire(import.meta.url)(path);
    if (test === null || typeof test !== "object") {
      throw new Error("Test does not expose an export");
    }
    if (typeof test.main !== "function") {
      throw new Error("Test does not expose a main function");
    }
    test.main();
  }
  else if (path.endsWith(".mjs")) {
    console.log(`Loading test script ${path} via import...`);
    const test = await import(path);
    if (test === null || typeof test !== "object") {
      throw new Error("Test does not expose an export");
    }
    if (typeof test.main !== "function") {
      throw new Error("Test does not expose a main function");
    }
    test.main();
  }
  else {
    throw new Error(`Unknown test script ${path}`);
  }
}

/**
 * @param {string} testDir 
 * @returns {string}
 */
function findTestScript(testDir) {
  const testScriptJs = path.join(testDir, "run-test.js");
  const testScriptMjs = path.join(testDir, "run-test.mjs");
  if (fs.existsSync(testScriptJs)) {
    return testScriptJs;
  }
  if (fs.existsSync(testScriptMjs)) {
    return testScriptMjs;
  }
  throw new Error(`No test script found at ${testDir}`);
}

/**
 * @param {string} dir 
 * @returns {Promise<TestResult>}
 */
async function runTest(dir) {
  console.log("");
  console.log(" > Running test", dir);
  const testDir = path.join(getDirname(import.meta), "..", "..", dir);
  console.log(testDir);
  const testScript = findTestScript(testDir);
  try {
    await runTestScript(testScript);
    return { success: true, path: dir };
  }
  catch (e) {
    return { success: false, path: dir, error: e instanceof Error ? e : new Error(String(e)) };
  }
}

/**
 * @param {string | undefined} value 
 * @returns {boolean}
 */
function notEmpty(value) {
  return value !== undefined && value.length > 0;
}

/**
 * @template T
 * @param {T | undefined} value 
 * @returns {value is T}
 */
function notUndefined(value) {
  return value !== undefined;
}

/**
 * @param {string[]} argv 
 * @return {Set<string>}
 */
function getTestsToRun(argv) {
  return new Set(argv
    .map((arg, index, args) => arg === "-test" || arg === "--test" ? args[index + 1] : undefined)
    .filter(notUndefined)
    .filter(notEmpty));
}

async function main() {
  const base = path.resolve(getDirname(import.meta), "..", "..");
  const allTests = await readAvailableTests(base);
  const targets = getTestsToRun(process.argv);
  const tests = targets.size === 0 ? allTests : allTests.filter(test => targets.has(test));

  if (tests.length === 0) {
    throw new Error("No tests were found");
  }

  const esmDir = path.join(getDirname(import.meta));
  const umdDir = path.join(getDirname(import.meta), "..", "umd");
  await spawnNpm(["install"], esmDir);
  await spawnNpm(["install"], umdDir);

  /** @type {{success: Success[], failure: Failure[]}} */
  const results = { success: [], failure: [] };
  for (const test of tests) {
    const result = await runTest(test);
    if (result.success === true) {
      results.success.push(result);
    }
    if (result.success === false) {
      results.failure.push(result);
    }
  }
  console.log("");
  console.log(` > Tests finished, ${results.success.length} successful, ${results.failure.length} failed`);
  for (const failure of results.failure) {
    console.log("");
    console.error(` > Test ${failure.path} failed:`);
    console.error(failure.error);
  }
  if (results.failure.length > 0) {
    throw new Error("There are test failures, see above");
  }
}

main().catch(e => {
  console.error("Error while running test:", e);
  process.exit(1);
});