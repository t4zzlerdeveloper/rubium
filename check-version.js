//credit to @diptimaya.patra

import fs from "fs";

const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const packageJson = loadJSON('./package.json');

const currentVersion = packageJson.version;
let [major, minor, patch] = currentVersion.split(".");
major = parseInt(major);
minor = parseInt(minor);
patch = parseInt(patch);

let newVersion = "";

if (patch === 999) {
  let newPatch = 0;
  let newMinor = minor + 1;
  let newMajor = major;

  if (newMinor > 9) {
    newMinor = 0;
    newMajor = major + 1;
  }

  newVersion = `${newMajor}.${newMinor}.${newPatch}`;
} else {
  let newPatch = patch + 1;
  let newMinor = minor;
  let newMajor = major;

  newVersion = `${newMajor}.${newMinor}.${newPatch}`;
}

if (newVersion !== currentVersion) {
  packageJson.version = newVersion;
  fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));
  console.log(`Version updated to ${newVersion}`);
} else {
  console.log("No version update required");
}