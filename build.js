// build.js
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import CleanCSS from "clean-css";
import { minify } from "terser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, "src");
const DIST_DIR = path.join(__dirname, "dist");

async function build() {
  console.log("Building...");

  // Clean and recreate dist
  await fs.emptyDir(DIST_DIR);

  // Process all files recursively
  await processDirectory(SRC_DIR, DIST_DIR);

  console.log("✅ Build complete!");
}

async function processDirectory(srcDir, destDir) {
  const files = await fs.readdir(srcDir);

  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const stats = await fs.stat(srcPath);

    if (stats.isDirectory()) {
      const destSubDir = path.join(destDir, file);
      await fs.ensureDir(destSubDir);
      await processDirectory(srcPath, destSubDir);
    } else {
      await processFile(srcPath, destDir);
    }
  }
}

async function processFile(srcPath, destDir) {
  const ext = path.extname(srcPath);
  const base = path.basename(srcPath, ext);

  if (ext === ".js") {
    const code = await fs.readFile(srcPath, "utf8");
    const result = await minify(code);
    const destPath = path.join(destDir, `${base}.min.js`);
    const reactDestPath = path.join(__dirname, 'examples', 'react-example', 'src', 'libs', `${base}.min.js`);
    await fs.outputFile(destPath, result.code);
    await fs.outputFile(reactDestPath, result.code);
    console.log(`🌀 Minified JS → ${path.relative(__dirname, destPath)}`);
  } else if (ext === ".css") {
    const css = await fs.readFile(srcPath, "utf8");
    const output = new CleanCSS().minify(css);
    const destPath = path.join(destDir, `${base}.min.css`);
    const reactDestPath = path.join(__dirname, 'examples', 'react-example', 'src', 'libs', `${base}.min.css`);
    await fs.outputFile(destPath, output.styles);
    await fs.outputFile(reactDestPath, output.styles);
    console.log(`🎨 Minified CSS → ${path.relative(__dirname, destPath)}`);
  } else if (fs.statSync(srcPath).isFile()) {
    const destPath = path.join(destDir, path.basename(srcPath));
    const reactDestPath = path.join(__dirname, 'examples', 'react-example', 'src', 'libs', path.basename(srcPath));
    await fs.copy(srcPath, destPath);
    await fs.copy(srcPath, reactDestPath);
    console.log(`📄 Copied → ${path.relative(__dirname, destPath)}`);
  }
}

build().catch(err => {
  console.error("❌ Build failed:", err);
  process.exit(1);
});
