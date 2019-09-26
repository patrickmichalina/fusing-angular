import { spawn, ChildProcess } from "child_process"

export const ngc = (tsconfig = 'src/tsconfig.json') => new Promise((resolve, reject) => {
  const child = spawn('node_modules/.bin/ngc', ['-p', tsconfig])

  if (child.stderr) {
    child.stderr.on('data', err => reject(err.toString()))
  }
  child.on("exit", resolve)
  child.on("error", reject)
})

export const ngcWatch = (tsconfig = 'src/tsconfig.json') => new Promise<ChildProcess>((resolve, _reject) => {
  const child = spawn('node_modules/.bin/ngc', ['-p', tsconfig, '-w'])
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