async function main() {
  await require("./webpack-ts/run-test.js").main();
}

main().catch(e => {
  console.error("Error while running test", e);
  process.exit(1);
});