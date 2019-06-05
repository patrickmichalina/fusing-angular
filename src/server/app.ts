import * as express from 'express'
import * as cookies from 'cookie-parser'
import * as compression from 'compression'
import { ngExpressEngine } from '@nguniversal/express-engine'
import { registerApi } from './api'
import { reader } from 'typescript-monads'
import { IConfig } from './config'
import { join } from 'path'

declare const $ngServerBootstrap: any

export const createExpressApplication = reader<IConfig, express.Application>(config => {
  const app = express()
  const publicDir = join(config.DIST_FOLDER, config.WWW_ROOT)
  const expressStaticGzip = require('express-static-gzip')

  app.use(cookies())
  app.disable('etag')
  app.disable('x-powered-by')
  app.set('view engine', 'html')
  app.set('views', publicDir)
  app.engine('html', ngExpressEngine({ bootstrap: $ngServerBootstrap }))

  app.get('/', compression(), (req, res) => res.render('index', { req }))

  app.use('/', expressStaticGzip(publicDir, {
    etag: false,
    enableBrotli: true,
    fallthrough: true,
    orderPreference: ['br', 'gzip'] as ReadonlyArray<string>,
    setHeaders: (res: express.Response) => {
      res.setHeader('Cache-Control',
        config.NODE_DEBUG
          ? 'no-store'
          : `public, max-age=31536000, s-maxage=31536000`
      )
    }
  }))

  registerApi(app)

  app.get('*', compression(), (req, res) => {
    res.render('index', { req })
  })

  return app
})
