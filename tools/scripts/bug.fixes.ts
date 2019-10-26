import { readFileSync, writeFileSync } from 'fs'

const path1 = 'node_modules/@flosportsinc/ng-env-transfer-state/bundles/flosportsinc-ng-env-transfer-state-server.umd.js'
const path2 = 'node_modules/@flosportsinc/ng-env-transfer-state/bundles/flosportsinc-ng-env-transfer-state-browser.umd.js'
const path5 = 'node_modules/typescript/lib/typescript.js'

const str1 = readFileSync(path1).toString()
const str2 = readFileSync(path2).toString()
const str5 = readFileSync(path5).toString()

writeFileSync(path1, str1.replace(/,global.@flosportsinc\/ng-env-transfer-state/gm, ''))
writeFileSync(path2, str2.replace(/,global.@flosportsinc\/ng-env-transfer-state/gm, ''))
writeFileSync(path5, str5
  .replace(/var typeAsString = typeToString\(getWidenedType\(type\)\);/gi, 'if (!declaration) return; var typeAsString = typeToString\(getWidenedType\(type\)\);')
  .replace(/ts.Debug.fail\(\"Did not expect \" \+ ts.Debug.formatSyntaxKind\(parent.kind\) \+ \" to have an Identifier in its trivia\"\);/g, 'return;'))
