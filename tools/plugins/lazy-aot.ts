import { Context } from "fuse-box/core/Context"
import { maybe } from "typescript-monads"

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
const importStr = (path: string, moduleName: string) => 
  `loadChildren: () => import('${path}').then(m => m.${moduleName})`

export function pluginAngularAot() {
  return (ctx: Context) => {
    ctx.ict.on('assemble_module_init', props => {
      if (props) {
        if (/-routing\./g.test(props.module.props.absPath)) {
          props.module.read()
          const file = props.module.contents
          const ptrnLazy = /loadChildren.+?(?=}.})+}/g
          
          const ma = ptrnLazy.exec(props.module.contents)
          if (ma) {
            const lazySript = ma[0]
            const ptrnPath = /(.\/.*.module)/g
            const maybePath = ptrnPath.exec(lazySript)
            if (maybePath) {
              const path = maybePath[0]
              const modName = maybe(path.split('/').pop())
                .map(str => {
                  const split = str.split('.')
                  return capitalize(split[0]) + capitalize(split[1])
                }).map(modNam => importStr(path, modNam))

              modName.tapSome(final => {
                props.module.contents = file.replace(ptrnLazy, final)
              })
            }
          }
        }
      }
      return props
    })
  }
}
