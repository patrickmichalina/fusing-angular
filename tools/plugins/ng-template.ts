import { Context } from "fuse-box/core/Context"
import { resolve } from "path"
import { readFileSync } from "fs"
import { Module } from "fuse-box/core/Module"
import { generateHMRContent } from 'fuse-box/hmr/hmr_content'

const write = (module: Module) => {
  const templatePath = resolve(module.props.absPath.replace('.ts', '.html'))
  const cssPath = resolve(module.props.absPath.replace('.ts', '.css'))
  try {
    const templateFile = readFileSync(templatePath)
    module.contents = module.contents.replace(/templateUrl(.*?)(["'`])(.*?)(["'`])/g, `template: '${templateFile.toString().replace(/\r?\n|\r/g, '')}'`)
  } catch { }

  try {
    const cssFile = readFileSync(cssPath)
    module.contents = module.contents.replace(/styleUrls(.*?)(["'`])]/g, `styles: ['${cssFile.toString().replace(/\r?\n|\r/g, '')}']`)
  } catch { }
}

export type IPluginReplaceProps = { [key: string]: any }
export function ngTemplatePlugin(a?: IPluginReplaceProps | string | RegExp, b?: IPluginReplaceProps) {

  return (ctx: Context) => {
    ctx.ict.on('soft_relod', props => {
      const module = Array.from(ctx.assembleContext.collection.modules.values()).filter(a => a.props.absPath.split('.')[0] === props.info.filePath.split('.')[0]).pop()

      if (module) {
        ctx.log.progressFormat('ngTemplatePlugin', 'replacing styles+templates in $file', {
          file: module.props.absPath,
        })
        write(module)
        ctx.cache.set(ctx.cache.getModuleCacheKey(module), module.contents)

        if (ctx.devServer) {
          // const generated = generateHMRContent({ packages: [], modules: [module], ctx: ctx })
          // ctx.devServer.clientSend('hmr', {
          //   packages: generated.packages,
          //   modules: generated.modules
          // })
        }
      }
      return props
    })

    ctx.ict.on('bundle_resolve_module', props => {
      if (props && props.module.props.absPath.match(/.+?\.component.ts/g)) {
        ctx.log.progressFormat('ngTemplatePlugin', 'replacing styles+templates in $file', {
          file: props.module.props.absPath,
        })

        write(props.module)
      }

      return props
    })
  }
}