// @ts-check

const fs = require("fs");
const cp = require("child_process");

/**
 * @param {string} dir 
 */
exports.removeDir = async (dir) => {
  await fs.promises.rm(dir, { recursive: true, force: true });
}

/**
 * @param {string} command
 * @param {string[]} args
 * @param {string} cwd
 */
async function spawnSimple(command, args, cwd) {
  const { error, status } = cp.spawnSync(command, args, {
    stdio: ["inherit", "inherit", "inherit"],
    cwd: cwd,
  });
  if (error) throw error;
  if (status !== 0) throw new Error(`Process exited with ${status}`);
}

/**
 * @param {string[]} args
 * @param {string} cwd
 */
async function spawnNpm(args, cwd) {
  try {
    await spawnSimple("npm", args, cwd);
  }
  catch (e) {
    if (e.code === "ENOENT") {
      console.info("npm not found, using npm.cmd");
      await spawnSimple("npm.cmd", args, cwd);
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

exports.spawnSimple = spawnSimple;
exports.spawnNpm = spawnNpm;
exports.loadHtml = loadHtml;
