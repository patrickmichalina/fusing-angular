import * as express from 'express'
import * as cookies from 'cookie-parser'
import * as compression from 'compression'
import * as expeditious from 'express-expeditious'
import { resolve } from 'path'
import { ngExpressEngine } from '@nguniversal/express-engine'
import { AppServerModule } from './angular/server.angular.module'
import { registerApi } from './api'

const app = express()
const dir = resolve('dist')
const publicDir = `${dir}/public`
const expressStaticGzip = require('express-static-gzip')
const cache = expeditious({
  namespace: 'expresscache',
  defaultTtl: '30 seconds' // TODO: part of IReader config w/ Redis engine
});

app.disable('x-powered-by')
app.use(cookies())
app.set('view engine', 'html')
app.set('views', publicDir)
app.engine('html', ngExpressEngine({ bootstrap: AppServerModule }))

app.use(cache)
app.get('/', compression(), (req, res) => res.render('index', { req }))

app.use('/', expressStaticGzip(publicDir, {
  enableBrotli: true,
  orderPreference: ['br', 'gzip'] as ReadonlyArray<string>,
  fallthrough: true
  //TODO: maxAge: config.NODE_DEBUG ? '0' : '7d' // TODO: part of IReader config
}))

registerApi(app)

app.get('*', compression(), (req, res) => {
  res.render('index', { req })
})

export { app }