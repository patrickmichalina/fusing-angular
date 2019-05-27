export interface IBundleOptions {
  readonly name: string
  readonly inputPath: string
  readonly outputPath: string
  readonly ignoredModules: string[]
}

export interface IBundleable<T extends Partial<IBundleOptions> | Required<IBundleOptions> = Partial<IBundleOptions>> {
  readonly bundle: T
  readonly rootDir: string
}

export type IRequiredBundleable = IBundleable<Required<IBundleOptions>>

export interface IEnableable {
  readonly enabled: boolean
}

export interface IUniversalServerOptions extends IBundleable, IEnableable { }
export interface IElectronOptions extends IBundleable, IEnableable { }
export interface IRequiredUniversalServerOptions extends IRequiredBundleable, IEnableable { }
export interface IRequiredElectronOptions extends IRequiredBundleable, IEnableable { }

export interface BaseBrowserOptions {
  readonly supportIE11: boolean
  readonly supportIE11Animations: boolean
  readonly indexTemplatePath: string
}

export interface IBrowserOptions extends BaseBrowserOptions, IBundleable { }
export interface IRequiredBrowserOptions extends BaseBrowserOptions, IRequiredBundleable { }

export interface IProductionBuildOptions extends IEnableable {
  readonly minify: boolean
  readonly treeshake: boolean
}

export interface BaseOptions {
  readonly enableAotCompilaton: boolean
  readonly enableAngularAnimations: boolean
  readonly enableAngularForms: boolean
  readonly enableServiceWorker: boolean
  readonly enableAngularBuildOptimizer: boolean
  readonly watch: boolean
  readonly srcRoot: string
  readonly outputDirectory: string
  readonly vendorBundleName: string
  readonly browserAotEntry: string
  readonly jsOutputDir: string
  readonly jsLazyModuleDir: string
  readonly serve: boolean
  readonly browser: Partial<IBrowserOptions>
  readonly electron: Partial<IElectronOptions>
  readonly universal: Partial<IUniversalServerOptions>
  readonly optimizations: Partial<IProductionBuildOptions>
}

export type PartialOptions = Partial<BaseOptions>

export interface Options extends BaseOptions {
  readonly browser: Required<IRequiredBrowserOptions>
  readonly electron: Required<IRequiredElectronOptions>
  readonly universal: Required<IRequiredUniversalServerOptions>
  readonly optimizations: Required<IProductionBuildOptions>
}