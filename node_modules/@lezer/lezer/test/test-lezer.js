import {parser} from "../dist/index.js"
import {fileTests} from "@lezer/generator/dist/test"

import * as fs from "fs"
import * as path from "path"
import {fileURLToPath} from "url"
let caseDir = path.dirname(fileURLToPath(import.meta.url))

for (let file of fs.readdirSync(caseDir)) {
  if (!/\.txt$/.test(file)) continue
  let name = /^[^\.]*/.exec(file)[0]
  describe(name, () => {
    for (let {name, run} of fileTests(fs.readFileSync(path.join(caseDir, file), "utf8"), file))
      it(name, () => run(parser))
  })
}

let root = path.join(caseDir, "..", "..")
if (fs.existsSync(path.join(root, "bin", "lz.js"))) describe("Other grammars", () => {
  // We're in a dev setup, with other grammars in sibling directories
  let strictParser = parser.configure({strict: true})
  for (let dir of fs.readdirSync(root)) {
    let src = path.join(root, dir, "src")
    if (fs.existsSync(src)) for (let file of fs.readdirSync(src)) if (/\.grammar$/.test(file)) {
      it(`${dir}/src/${file}`, () => {
        strictParser.parse(fs.readFileSync(path.join(src, file), "utf8"))
      })
    }
  }
})
