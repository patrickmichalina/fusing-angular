import { Plugin, File } from 'fuse-box'

const defaults: NgPolyfillPluginOptions = {}

export interface NgPolyfillPluginOptions {
  isServer?: boolean
  fileTest?: string
}

export const NG_POLY_BASE = [
  'core-js/proposals/reflect-metadata'
]
export const NG_POLY_SERVER = [
  ...NG_POLY_BASE,
  'zone.js/dist/zone-node',
  'zone.js/dist/long-stack-trace-zone'
]
export const NG_POLY_BROWSER = [
  ...NG_POLY_BASE,
  'zone.js/dist/zone'
]
export const NG_POLY_BROWSER_IE_ANIMATIONS = [
  'web-animations-js'
]
export const NG_POLY_BROWSER_IE = [
  'core-js/features/symbol',
  'core-js/features/object',
  'core-js/features/function',
  'core-js/features/parse-int',
  'core-js/features/parse-float',
  'core-js/features/number',
  'core-js/features/math',
  'core-js/features/string',
  'core-js/features/date',
  'core-js/features/array',
  'core-js/features/regexp',
  'core-js/features/map',
  'core-js/features/weak-map',
  'core-js/features/set'
]

const prepForTransform = (deps: string[]) => {
  return deps.map(dep => {
    return `import '${dep}'`
  }).join('\n')
}

export class NgPolyfillPluginClass implements Plugin {
  constructor(private opts: NgPolyfillPluginOptions = defaults) { }
  public test: RegExp = this.opts.fileTest &&
    new RegExp(this.opts.fileTest) || /(main.ts|main.aot.ts)/
  public dependencies: ['zone.js', 'core-js']

  onTypescriptTransform(file: File) {
    if (!this.test.test(file.relativePath)) return
    file.contents = `${prepForTransform(this.buildSet())}\n${file.contents}`
  }

  buildSet() {
    if (this.opts.isServer) {
      return NG_POLY_SERVER
    } else {
      return NG_POLY_BROWSER
    }
  }
}

export const NgPolyfillPlugin = (options?: NgPolyfillPluginOptions) => new NgPolyfillPluginClass(options);
