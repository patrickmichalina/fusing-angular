import 'zone.js/dist/zone-node'
import 'core-js/proposals/reflect-metadata'
import * as express from 'express'
import * as cookies from 'cookie-parser'
import * as compression from 'compression'
import { ngExpressEngine } from '@nguniversal/express-engine'
import { registerApi } from './api'
import { reader } from 'typescript-monads'
import { IConfig } from './config'
import { join } from 'path'
import { AppServerModule } from './angular/server.angular.module'

export const createExpressApplication = reader<IConfig, express.Application>(config => {
  const app = express()
  const publicDir = join(config.DIST_FOLDER, config.WWW_ROOT)
  const expressStaticGzip = require('express-static-gzip')

  app.use(cookies())
  app.disable('x-powered-by')
  app.set('view engine', 'html')
  app.set('views', publicDir)
  app.engine('html', ngExpressEngine({ bootstrap: AppServerModule }) as any)

  const settings = {
    enableBrotli: true,
    fallthrough: false,
    orderPreference: ['br', 'gzip'] as ReadonlyArray<string>,
    setHeaders: (res: express.Response, _reqUrl: string) => {
      res.setHeader('Cache-Control',
        config.NODE_DEBUG
          ? 'no-store'
          : `public, max-age=31536000, s-maxage=31536000`
      )
    }
  }

  app.get('/manifest.json', expressStaticGzip(publicDir, settings))
  app.get('/ngsw-worker.js', expressStaticGzip(publicDir, settings))
  app.get('/ngsw.json', expressStaticGzip(publicDir, settings))
  app.use('/assets', expressStaticGzip(publicDir, settings))

  registerApi(app)

  app.get('*', compression(),  (req: express.Request, res: express.Response) => {
    res.render('index', { req, res })
  })

  return app
})
