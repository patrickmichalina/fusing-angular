import * as express from 'express'
// import * as cookies from 'cookie-parser'
import * as compression from 'compression'
import { ngExpressEngine } from '@nguniversal/express-engine'
import { registerApi } from './api'
import { reader } from 'typescript-monads'
import { IConfig } from './config'
import { join } from 'path'




export const createExpressApplication = reader<IConfig, express.Application>(config => {
  const app = express()
  const publicDir = join(config.DIST_FOLDER, config.WWW_ROOT)
  const expressStaticGzip = require('express-static-gzip')

  // app.use(cookies('test'))
  app.disable('x-powered-by')
  app.set('view engine', 'html')
  app.set('views', publicDir)
  app.engine('html', ngExpressEngine({ bootstrap: require('./angular/server.angular.module').AppServerModule }) as any)

  const angularRender = (req: express.Request, res: express.Response) => {
    res.cookie('key1', 123, { sameSite: true })
    res.cookie('key2', JSON.stringify({ test: 456 }))
    res.render('index', { req, res })
  }

  app.get('/', compression(), angularRender)

  app.use('/', expressStaticGzip(publicDir, {
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

  app.get('*', compression(), angularRender)

  return app
})
