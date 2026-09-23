import { build } from "esbuild";
import { readFileSync } from "node:fs";

const { version } = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));

const common = {
    entryPoints: ["src/index.js"],
    bundle: true,
    target: ["es2020"],
    banner: { js: `/*! key.pics v${version} | MIT | https://key.pics */` },
    logLevel: "info",
};

await Promise.all([
    // <script src="…/key.pics.js"> exposes window.KeyPics
    build({ ...common, format: "iife", globalName: "KeyPics", outfile: "dist/key.pics.js" }),
    build({ ...common, format: "iife", globalName: "KeyPics", minify: true, sourcemap: true, outfile: "dist/key.pics.min.js" }),
    // import { applyIcon } from "key.pics"
    build({ ...common, format: "esm", outfile: "dist/key.pics.esm.js" }),
    // const { applyIcon } = require("key.pics")
    build({ ...common, format: "cjs", outfile: "dist/key.pics.cjs" }),
]);
