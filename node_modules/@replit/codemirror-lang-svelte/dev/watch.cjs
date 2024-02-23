const {watch} = require("@codemirror/buildhelper")
const {resolve} = require("path")

let args = process.argv.slice(2)

console.log(args)

if (args.length != 1) {
  console.log("Usage: cm-buildhelper src/mainfile.ts")
  process.exit(1)
}

watch([resolve(args[0])])