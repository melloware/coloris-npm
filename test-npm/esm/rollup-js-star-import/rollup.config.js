import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: "src/main.js",
    output: {
        dir: "dist",
        format: "iife"
    },
    plugins: [nodeResolve({})]
};
