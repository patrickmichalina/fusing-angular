import { spawn } from "child_process"

export const ngc = () => new Promise((resolve, reject) => {
  const child = spawn('node_modules/.bin/ngc', ['-p', 'src/tsconfig.json'])
  child.stderr && child.stderr.on('data', resolve)
  child.addListener("error", reject)
})

export const ngcWatch = () => new Promise((resolve, _reject) => {
  const child = spawn('node_modules/.bin/ngc', ['-p', 'src/tsconfig.json', '-w'])
  child.addListener("exit", resolve)
  child.stderr && child.stderr.on('data', msg => {
    console.log(msg.toString())
    resolve()
  })
  child.addListener("error", err => {
    console.error(err)
  })
})