// Render key frames of a composition into PNGs for quick visual review.
// Usage: node scripts/stills.mjs <compositionId> <outDir> <frame> [frame...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const [id, outDir, ...frames] = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER || null;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id, browserExecutable });
for (const frame of frames.map(Number)) {
  const output = path.join(outDir, `${id}-${String(frame).padStart(5, "0")}.png`);
  await renderStill({ serveUrl, composition, frame, output, browserExecutable, scale: 0.5 });
  console.log(output);
}
