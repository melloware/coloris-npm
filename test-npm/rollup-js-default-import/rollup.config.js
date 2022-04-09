import commonjs from "@rollup/plugin-commonjs";

export default {
    input: "src/main.js",
    output: {
        dir: "dist",
        format: "iife"
    },
    plugins: [commonjs()]
};
