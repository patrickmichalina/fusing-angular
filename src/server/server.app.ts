import * as express from 'express'
import * as cookieParser from 'cookie-parser'
import { resolve } from 'path'
import { ngExpressEngine } from '@nguniversal/express-engine'
import { AppServerModule } from './server.angular.module'
import { writeFile, stat } from 'fs'
import { bindNodeCallback } from 'rxjs';

const expressApp = express()
const dir = resolve('./.dist')
const publicDir = `${dir}/public`

expressApp.use(cookieParser())
expressApp.use('/js', express.static(`${publicDir}/js`))
expressApp.set('view engine', 'html')
expressApp.engine('html', ngExpressEngine({ bootstrap: AppServerModule }))

const virtualIndex = (req: express.Request,
  res: express.Response, document: string, path = `${publicDir}/index.html`) => {

  const resolvedPath = resolve(path)

  bindNodeCallback(stat)(resolvedPath).toPromise()
    .then(() => {
      res.render(resolvedPath, {
        req,
        res,
        document
      });
    })
    .catch(() => bindNodeCallback(writeFile)(resolvedPath, '').toPromise()
      .then(() => virtualIndex(req, res, document, path)))
}

expressApp.get('**', (req, res) => {
  const document = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Fusing Angular</title>
    <base href="/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <app-root></app-root>
    <script src="/js/vendor.js"></script>
    <script src="/js/app.js"></script>
  </body>
</html>`
  virtualIndex(req, res, document)
})

export { expressApp }