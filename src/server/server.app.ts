import * as express from 'express'
import * as cookieParser from 'cookie-parser'
import { resolve } from 'path'
import { ngExpressEngine } from '@nguniversal/express-engine'
import { AppServerModule } from './server.angular.module'
import { stat, writeFile } from 'fs/promises'
// import { createLogger } from '@expo/bunyan'
// import { ngExpressEngine } from '@nguniversal/express-engine'

const shrinkRay = require('shrink-rayed')
const minifyHTML = require('express-minify-html')
// const bunyanMiddleware = require('bunyan-middleware')
// const xhr2 = require('xhr2')
// const cors = require('cors')

// tslint:disable-next-line:no-object-mutation
// xhr2.prototype._restrictedHeaders.cookie = false

const expressApp = express()
const dir = resolve('./.dist')
const publicDir = `${dir}/public`

// const staticOptions = {
//   index: false,
//   maxAge: isProd ? ms('1y') : ms('0'),
//   setHeaders: (res: express.Response, path: any) => {
//     res.setHeader(
//       'Expires',
//       isProd
//         ? new Date(Date.now() + ms('1y')).toUTCString()
//         : new Date(Date.now() + ms('0')).toUTCString()
//     )
//   }
// }

// !isEndToEndTest &&
//   app.use(
//     bunyanMiddleware({
//       logger: createLogger({
//         name: 'Fusing-Angular',
//         type: 'node-express'
//       }),
//       excludeHeaders: ['authorization', 'cookie']
//     })
//   )


expressApp.use(cookieParser())
expressApp.use(shrinkRay())
// app.use(cors())
expressApp.use(
  minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: false,
      minifyJS: true
    }
  })
)

expressApp.use('/favicon.ico', (req, res) => res.sendStatus(204)) // TODO: FAVICONS
expressApp.use('/js', express.static(`${publicDir}/js`))
expressApp.set('view engine', 'html')
expressApp.engine('html', ngExpressEngine({ bootstrap: AppServerModule }))

const virtualIndex = (req: express.Request,
  res: express.Response, document: string, path = `${publicDir}/index.html`) => {

  const resolvedPath = resolve(path)

  stat(resolvedPath)
    .then(() => {
      res.render(resolvedPath, {
        req,
        res,
        document
      });
    })
    .catch(() => writeFile(resolvedPath, '')
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

// app.use('/ngsw.json', express.static(`${dir}/ngsw.json`, staticOptions))
// app.use(
//   '/ngsw-worker.js',
//   express.static(`${dir}/ngsw-worker.js`, staticOptions)
// )
// app.use(
//   '/assets',
//   express.static(`${dir}/assets`, { ...staticOptions, fallthrough: false })
// )
// app.use(
//   '/manifest.json',
//   express.static(`${dir}/assets`, { ...staticOptions, fallthrough: false })
// )



///////////////////////////////////
// app.use('/robots.txt', express.static(`${dir}/web/robots.txt`, staticOptions))
// app.use('/ping.html', express.static(`${dir}/web/ping.html`, staticOptions))
// app.use(
//   '/favicon.ico',
//   express.static(`${dir}/assets/favicons/favicon-16x16.png`, {
//     ...staticOptions,
//     fallthrough: false
//   })
// )
// app.use(
//   '/assets/favicons/favicon.ico',
//   express.static(`${dir}/assets/favicons/favicon-16x16.png`, {
//     ...staticOptions,
//     fallthrough: false
//   })
// )

export { expressApp }