import * as express from 'express'
// import * as cookieParser from 'cookie-parser'
// import { createLogger } from '@expo/bunyan'
// import { ngExpressEngine } from '@nguniversal/express-engine'
// import { AppServerModule } from './angular/server.angular.module'
import { resolve } from 'path'
const shrinkRay = require('shrink-rayed')
// const minifyHTML = require('express-minify-html')
// const bunyanMiddleware = require('bunyan-middleware')
// const xhr2 = require('xhr2')
// const cors = require('cors')

// tslint:disable-next-line:no-object-mutation
// xhr2.prototype._restrictedHeaders.cookie = false

// require('ts-node/register')

const expressApp = express()

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

const dir = resolve('./.dist')

// expressApp.engine('html', ngExpressEngine({ bootstrap: AppServerModule }))
// app.set('ignore-routes', ['/api/'])
// app.set('view engine', 'html')
// app.set('views', dir)
// app.use(cookieParser())
expressApp.use(shrinkRay())
// app.use(cors())
// app.use(
//   minifyHTML({
//     override: true,
//     exception_url: false,
//     htmlMinifier: {
//       removeComments: true,
//       collapseWhitespace: true,
//       collapseBooleanAttributes: true,
//       removeAttributeQuotes: false,
//       minifyJS: true
//     }
//   })
// )

// app.use('/css', express.static(`${dir}/css`, staticOptions))
expressApp.use('/js', express.static(`${dir}/public/js`))
expressApp.get('/**', (req, res) => {
    res.end(`<!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Fusing Angular Demo</title>
      <base href="/">
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      <app-root></app-root>
      <script src="/js/vendor.js"></script>
      <script src="/js/app.js"></script>
    </body>
    </html>`)
})
// app.use('/ngsw.json', express.static(`${dir}/ngsw.json`, staticOptions))
// app.use(
//   '/ngsw-worker.js',
//   express.static(`${dir}/ngsw-worker.js`, staticOptions)
// )
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
// app.use(
//   '/assets',
//   express.static(`${dir}/assets`, { ...staticOptions, fallthrough: false })
// )
// app.use(
//   '/manifest.json',
//   express.static(`${dir}/assets`, { ...staticOptions, fallthrough: false })
// )
// app.get('/ad-server.js', (req, res) => res.send({}))

// useApi(app)

// app.set('ignore-routes', ['/api/', '/css/', '/js/', '/assets/'])
// app.get(
//   '**',
//   (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     const bypassed = (req.app.get('ignore-routes') as ReadonlyArray<
//       string
//     >).some(a => req.url.includes(a))
//     return bypassed
//       ? next()
//       : res.render('index', {
//           req,
//           res
//         })
//   }
// )



export { expressApp }