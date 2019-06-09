// package.json dependencies need to be pruned becuase some may be Angular Universal server deps
// which should not be bundled inside the electron package. I am not a fan of this approach but 
// for sake of expedience, it will be used.

// read in current package.json
// save a copy to pacakge.json.tmp
// overwrite package.json 'dependencies' property with a reduced set of values.
// electorn-builder can now be run
// unwind changes 

import { promises } from 'fs'

const originalName = 'package.json'
const cloneName = 'package.json.clone'

export const pluckElectronPackages = () => {
  return promises
    .readFile(originalName)
    .then(file => Promise.all([
      promises.writeFile(cloneName, file),
      Promise.resolve(file.toString())
    ]))
    .then(file => Promise.resolve(JSON.parse(file[1])))
    .then(file => {
      const keys = (file['electron-natives'] || []) as string[]
      file.dependencies = keys
        .filter(a => a.includes(a))
        .reduce((acc, curr) => ({
          ...acc,
          [curr]: file.dependencies[curr] || file.devDependencies[curr]
        }), {})
      return promises.writeFile(originalName, JSON.stringify(file, undefined, 2)).catch(console.error)
    })
}

pluckElectronPackages()
