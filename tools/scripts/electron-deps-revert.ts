import { promises } from 'fs'

export const revertPackage = () =>
  promises
    .readFile('package.json.clone')
    .then(file => promises.writeFile('package.json', file))

revertPackage()
  .then(() => promises.unlink('package.json.clone'))