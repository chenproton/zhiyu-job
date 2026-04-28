import fs from "node:fs/promises"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { createRequire } from "node:module"
import ts from "typescript"

const require = createRequire(import.meta.url)
const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const distDir = path.join(rootDir, "dist")
const sourceDirs = ["api", "components", "hooks", "lib"]
const sourceFiles = ["index.ts"]

async function rmrf(target) {
  await fs.rm(target, { recursive: true, force: true })
}

async function ensureDir(target) {
  await fs.mkdir(target, { recursive: true })
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) return walk(fullPath)
      return fullPath
    })
  )
  return files.flat()
}

function rewriteRelativeImports(code) {
  return code.replace(/(from\s+["'])(\.\.?\/[^"']+)(["'])/g, (_, start, specifier, end) => {
    if (specifier.endsWith(".js") || specifier.endsWith(".mjs") || specifier.endsWith(".json")) {
      return `${start}${specifier}${end}`
    }
    return `${start}${specifier}.mjs${end}`
  })
}

async function compileSourceFile(filePath) {
  const source = await fs.readFile(filePath, "utf8")
  const relativePath = path.relative(rootDir, filePath)
  const outputBase = path.join(distDir, relativePath).replace(/\.(ts|tsx)$/, "")

  const esm = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    fileName: filePath,
  })

  const cjs = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    fileName: filePath,
  })

  await ensureDir(path.dirname(outputBase))
  await fs.writeFile(`${outputBase}.mjs`, rewriteRelativeImports(esm.outputText))
  await fs.writeFile(`${outputBase}.js`, cjs.outputText)
}

async function collectSourceFiles() {
  const nestedFiles = await Promise.all(
    sourceDirs.map(async (dir) => {
      const fullDir = path.join(rootDir, dir)
      return walk(fullDir)
    })
  )

  return [...sourceFiles.map((file) => path.join(rootDir, file)), ...nestedFiles.flat()].filter((file) =>
    /\.(ts|tsx)$/.test(file)
  )
}

function emitDeclarations() {
  const tscPath = require.resolve("typescript/lib/tsc.js")
  const result = spawnSync(
    process.execPath,
    [tscPath, "-p", "tsconfig.json", "--emitDeclarationOnly", "--declaration", "--outDir", "dist"],
    { cwd: rootDir, stdio: "inherit" }
  )

  if (result.status !== 0) {
    throw new Error("Failed to emit declaration files")
  }
}

async function build() {
  await rmrf(distDir)
  const files = await collectSourceFiles()
  await Promise.all(files.map(compileSourceFile))
  emitDeclarations()
}

build().catch((error) => {
  console.error(error)
  process.exit(1)
})
