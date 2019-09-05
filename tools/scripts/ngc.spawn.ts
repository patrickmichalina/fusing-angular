import { spawn, ChildProcess } from "child_process"

export const ngc = () => new Promise((resolve, reject) => {
  const child = spawn('node_modules/.bin/ngc', ['-p', 'src/tsconfig.json'])

  if (child.stderr) {
    child.stderr.on('data', err => reject(err.toString()))
  }
  child.on("exit", resolve)
  child.on("error", reject)
})

export const ngcWatch = () => new Promise<ChildProcess>((resolve, _reject) => {
  const child = spawn('node_modules/.bin/ngc', ['-p', 'src/tsconfig.json', '-w'])
  child.addListener("exit", () => {
    resolve(child)
  })
  child.stderr && child.stderr.on('data', msg => {
    console.log(msg.toString())
    resolve(child)
  })
  child.addListener("error", err => {
    console.error(err)
  })
})