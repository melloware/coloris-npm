// @ts-check

const fs = require("fs");
const path = require("path");

const { spawnNpm, existsDir } = require("./helper");

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
async function readAvailableTests(base) {
  const dirs = await fs.promises.readdir(base);
  /** @type {string[]} */
  const tests = [];
  for (const name of dirs) {
    const dir = path.join(base, name);
    if (await existsDir(dir) && name !== "helper") {
      tests.push(name);
    }
  }
  return tests;
}

/**
 * @param {string} path 
 * @returns {Promise<TestResult>}
 */
async function runTest(path) {
  console.log("");
  console.log(" > Running test", path);
  try {
    await require(`./${path}/run-test.js`).main();
    return { success: true, path };
  }
  catch (e) {
    return { success: false, path, error: e instanceof Error ? e : new Error(String(e)) };
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
 * @param {string[]} argv 
 * @return {Set<string>}
 */
function getTestsToRun(argv) {
  return new Set(argv
    .map((arg, index, args) => arg === "-test" || arg === "--test" ? args[index + 1] : undefined)
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