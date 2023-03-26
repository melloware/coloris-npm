// @ts-check

const path = require("path");
const fs = require("fs");
const cp = require("child_process");

/**
 * @param {string} source 
 * @param {string} target 
 */
async function copyFile(source, target) {
  if (!existsFile(source)) {
    throw new Error(`No such file: ${source}`)
  }
  if (!existsDir(target)) {
    throw new Error(`Target is a directory: ${target}`)
  }
  await fs.promises.cp(source, target, { force: true, recursive: false });
}

/**
 * @param {number} millis 
 * @returns {Promise<void>}
 */
function delay(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

/**
 * @param {() => boolean} test 
 * @param {number} timeoutMillis
 * @param {number} checkIntervalMillis
 */
async function waitUntil(test, timeoutMillis = 10000, checkIntervalMillis = 250) {
  const start = Date.now();  
  while (!test()) {
    await delay(checkIntervalMillis);
    if (Date.now() - start > timeoutMillis) {
      throw new Error(`Condition did not evaluate to true after ${timeoutMillis}ms`);
    }
  }
}

/**
 * @template T
 * @param {Promise<T>} promise 
 * @param {number} timeoutMillis 
 * @return {Promise<T>}
 * @throws When the promise did not resolve before the given timeout.
 */
async function timeout(promise, timeoutMillis) {
  const result = await Promise.race([
    promise
      .then(value => {
        /**@type {{resolved: true, success: true, value: T}} */
        const wrapped = { resolved: true, success: true, value: value };
        return wrapped;
      })
      .catch(error => {
        /**@type {{resolved: true, success: false, error: unknown}} */
        const wrapped = { resolved: true, success: false, error: error };
        return wrapped;
      }),
    delay(timeoutMillis).then(() => {
      /**@type {{resolved: false}} */
      const wrapped = { resolved: false };
      return wrapped;
    })
  ]);
  if (result.resolved) {
    if (result.success === true) {
      return result.value;
    }
    if (result.success === false) {
      throw result.error;
    }
    throw new Error("result.success must be either true or false");
  }
  else {
    throw new Error(`Promise did not resolve after ${timeoutMillis}`);
  }
}

/**
 * @param {string} dir 
 * @returns {Promise<boolean>}
 */
async function existsDir(dir) {
  try {
    const stat = await fs.promises.stat(dir);
    return stat.isDirectory();
  }
  catch (e) {
    if (e.code === "ENOENT") {
      return false;
    }
    else {
      throw e;
    }
  }
}

/**
 * @param {string} file 
 * @returns {Promise<boolean>}
 */
async function existsFile(file) {
  try {
    const stat = await fs.promises.stat(file);
    return stat.isFile();
  }
  catch (e) {
    if (e.code === "ENOENT") {
      return false;
    }
    else {
      throw e;
    }
  }
}

/**
 * @param {string} dir
 */
async function removeDir(dir) {
  if (await existsDir(dir)) {
    console.log(` > Removing directory ${dir}`);
    await fs.promises.rm(dir, { recursive: true, force: true });
  }
}

/**
 * @param {string} file
 */
async function removeFile(file) {
  if (await existsFile(file)) {
    console.log(` > Removing file ${file}`);
    await fs.promises.rm(file, { force: true });
  }
}

/**
 * @param {string} dirname 
 */
async function clean(dirname) {
  await removeDir(path.join(dirname, "dist"));
  await removeDir(path.join(dirname, "node_modules"));
  await removeDir(path.join(dirname, ".parcel-cache"));
  await removeDir(path.join(dirname, ".yarn", "cache"));
  await removeDir(path.join(dirname, ".yarn", "unplugged"));
  await removeFile(path.join(dirname, ".yarn", "install-state.gz"));
  await removeFile(path.join(dirname, ".pnp.js"));
  await removeFile(path.join(dirname, ".pnp.cjs"));
  await removeFile(path.join(dirname, ".pnp.mjs"));
  await removeFile(path.join(dirname, ".pnp.loader.js"));
  await removeFile(path.join(dirname, ".pnp.loader.cjs"));
  await removeFile(path.join(dirname, ".pnp.loader.mjs"));
}

/**
 * @param {string} command
 * @param {string[]} args
 * @param {string} cwd
 */
async function spawnSimple(command, args, cwd) {
  const { error, status } = cp.spawnSync(command, args, {
    stdio: ["inherit", "inherit", "inherit"],
    env: process.env,
    cwd: cwd,
  });
  if (error) {
    throw error;
  }
  if (status !== 0) {
    throw new Error(`Process exited with ${status}`);
  }
}

/**
 * @param {string[]} args
 * @param {string} cwd
 */
async function spawnNpm(args, cwd) {
  console.log(` > Running yarn ${args.join(" ")}`);
  try {
    await spawnSimple("npm", args, cwd);
  }
  catch (e) {
    if (e.code === "ENOENT") {
      console.info("npm not found, using npm.cmd");
      await spawnSimple("npm.cmd", args, cwd);
    }
    else {
      throw e;
    }
  }
}

/**
 * @param {string[]} args
 * @param {string} cwd
 */
async function spawnYarn(args, cwd) {
  console.log(` > Running yarn ${args.join(" ")}`);
  try {
    await spawnSimple("yarn", args, cwd);
  }
  catch (e) {
    if (e.code === "ENOENT") {
      console.info("yarn not found, using yarn.cmd");
      await spawnSimple("yarn.cmd", args, cwd);
    }
    else {
      throw e;
    }
  }
}

/**
 * @param {typeof import("jsdom")} jsdom
 * @param {string} file
 * @returns {Promise<{dom: import("jsdom").JSDOM, virtualConsole: import("jsdom").VirtualConsole}>}
 */
async function loadHtml(jsdom, file) {
  const { JSDOM, VirtualConsole } = jsdom;

  /** @type {Error[]} */
  const errors = [];

  const virtualConsole = new VirtualConsole({ captureRejections: true });

  virtualConsole.on("debug", (...args) => {
    console.debug(...args);
  });

  virtualConsole.on("log", (...args) => {
    console.log(...args);
  });

  virtualConsole.on("info", (...args) => {
    console.info(...args);
  });

  virtualConsole.on("warn", (...args) => {
    console.warn(...args);
  });

  virtualConsole.on("error", (...args) => {
    console.error(...args);
    errors.push(new Error(args.join(" ")));
  });

  return new Promise((resolve, reject) => {
    /** @type {{dom: import("jsdom").JSDOM | undefined, loaded: boolean}} */
    const data = { dom: undefined, loaded: false };
    const check = () => {
      if (errors.length > 0) {
        reject(errors[0]);
      }
      if (data.dom !== undefined && (data.dom.window.document.readyState === "complete" || data.loaded)) {
        resolve({ dom: data.dom, virtualConsole });
      }
    };
    const domPromise = JSDOM.fromFile(file, {
      beforeParse: win => win.addEventListener("error", event => {
        console.error(event.message, event.error);
        errors.push(event.error instanceof Error ? event.error : new Error(String(event.message || event.error)));
      }),
      pretendToBeVisual: true,
      resources: "usable",
      runScripts: "dangerously",
      url: `file://${file}`,
      virtualConsole,
    });
    domPromise.then(dom => {
      data.dom = dom;
      dom.window.addEventListener("load", () => {
        data.loaded = true;
        check();
      });
      check();
    });
  });
}

function requireChai() {
  return require("chai");
}

function requireJsdom() {
  return require("jsdom");
}

exports.clean = clean;
exports.copyFile = copyFile;
exports.delay = delay;
exports.existsDir = existsDir;
exports.existsFile = existsFile;
exports.loadHtml = loadHtml;
exports.removeDir = removeDir;
exports.removeFile = removeFile;
exports.requireChai = requireChai;
exports.requireJsdom = requireJsdom;
exports.spawnSimple = spawnSimple;
exports.spawnNpm = spawnNpm;
exports.spawnYarn = spawnYarn;
exports.timeout = timeout;
exports.waitUntil = waitUntil;