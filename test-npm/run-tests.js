// @ts-check

const fs = require("fs");
const path = require("path");

const { spawnNpm, existsDir, spawnYarn } = require("./helper");

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
 * @param {string} dir 
 * @returns {Promise<TestResult>}
 */
async function runTest(dir) {
  console.log("");
  console.log(" > Running test", dir);
  const testDir = path.join(__dirname, dir);
  const testScript = path.join(testDir, "run-test.js");
  try {
    await require(testScript).main();
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
  const allTests = await readAvailableTests(__dirname);
  const targets = getTestsToRun(process.argv);
  const tests = targets.size === 0 ? allTests : allTests.filter(test => targets.has(test));

  if (tests.length === 0) {
    throw new Error("No tests were found");
  }

  await spawnNpm(["install"], path.join(__dirname, "helper"));

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