import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";

const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "docx",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    banner: {
      js: `const __import_meta_url = require("url").pathToFileURL(__filename).href;`,
    },
    plugins: [
      {
        name: "import-meta-and-cjs-fix",
        setup(build) {
          build.onLoad({ filter: /\.[tj]sx?$/ }, async (args) => {
            const fs = await import("fs/promises");
            let contents = await fs.readFile(args.path, "utf8");
            contents = contents.replace(/import\.meta\.url/g, "__import_meta_url");
            contents = contents.replace(/import\.meta\.dirname/g, "__dirname");
            contents = contents.replace(
              /import\s*\{\s*createRequire\s*\}\s*from\s*["']module["'];?/g,
              ""
            );
            contents = contents.replace(
              /const\s+\w+\s*=\s*createRequire\([^)]*\);?/g,
              ""
            );
            contents = contents.replace(
              /_require\s*\(/g,
              "require("
            );
            return { contents, loader: args.path.endsWith(".tsx") ? "tsx" : args.path.endsWith(".jsx") ? "jsx" : "ts" };
          });
        },
      },
    ],
    minify: true,
    external: [...externals, "pdf-parse", "pdf-parse/lib/pdf-parse.js", "pdfjs-dist/legacy/build/pdf.js", "canvas", "jszip", "pdf-lib", "libreoffice-convert", "html-to-docx", "node-fetch"],
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
