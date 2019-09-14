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
          const ptrnLazy = /loadChildren.+?(?=}.})+}/gm

          const d = maybe(props.module.contents.match(ptrnLazy))
            .map((importStatments: string[]) => importStatments
              .map(statement => {
                return {
                  statement,
                  path: (statement.match(/(.\/.*.module)/g) || [])[0]
                }
              }))
            .map(paths => {
              return paths.map(path => {
                const split = (path.path.split('/').pop() || '').split('.')
                return {
                  original: path.statement,
                  updated: importStr(path.path, capitalize(split[0]) + capitalize(split[1]))
                }
              })
            })

          d.tapSome(a => {
            a.forEach(res => {
              props.module.contents = props.module.contents.replace(res.original, res.updated)
            })
          })
        }
      }
      return props
    })
  }
}
