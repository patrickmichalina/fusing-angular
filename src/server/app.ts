import * as express from 'express'
import * as cookies from 'cookie-parser'
import * as compression from 'compression'
import { ngExpressEngine } from '@nguniversal/express-engine'
import { AppServerModule } from './angular/server.angular.module'
import { registerApi } from './api'
import { reader } from 'typescript-monads'
import { IConfig } from '../config'
import { join } from 'path'

export const createExpressApplication = reader<IConfig, express.Application>(config => {
  const app = express()
  const publicDir = join(config.DIST_FOLDER, config.WWW_ROOT)
  const expressStaticGzip = require('express-static-gzip')

  app.use(cookies())
  app.disable('x-powered-by')
  app.set('view engine', 'html')
  app.set('views', publicDir)
  app.engine('html', ngExpressEngine({ bootstrap: AppServerModule }))

  app.get('/', compression(), (req, res) => res.render('index', { req }))

  app.use('/', expressStaticGzip(publicDir, {
    enableBrotli: true,
    fallthrough: true,
    orderPreference: ['br', 'gzip'] as ReadonlyArray<string>,
    maxAge: config.NODE_DEBUG ? '0' : '7d'
  }))

  registerApi(app)

  app.get('*', compression(), (req, res) => {
    res.render('index', { req })
  })

  return app
})
