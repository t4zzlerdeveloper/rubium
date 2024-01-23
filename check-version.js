//credit to @diptimaya.patra

import fs from "fs";

const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const packageJson = loadJSON('./package.json');

function getGitVersion(){
    const rev = fs.readFileSync('.git/HEAD').toString().trim();
  if (rev.indexOf(':') === -1) {
      return rev.substring(0,7);
  } else {
      return fs.readFileSync('.git/' + rev.substring(5)).toString().trim().substring(0,7);
  }
}


  packageJson.hash = getGitVersion();
  fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));
  console.log(`Version updated to ${ packageJson.hash}`);
