import * as express from 'express'
import * as cookies from 'cookie-parser'
import { resolve } from 'path'
import { ngExpressEngine } from '@nguniversal/express-engine'
import { AppServerModule } from './server.angular.module'

const app = express()
const dir = resolve('dist')
const publicDir = `${dir}/public`
const expressStaticGzip = require('express-static-gzip')

app.disable('x-powered-by')
app.use(cookies())
app.set('view engine', 'html')
app.set('views', publicDir)
app.engine('html', ngExpressEngine({ bootstrap: AppServerModule }))

app.get('/', (req, res) => res.render('index', { req }))

app.use('/', expressStaticGzip(publicDir, {
  enableBrotli: true,
  orderPreference: ['br', 'gzip'] as ReadonlyArray<string>,
  fallthrough: true
  // maxAge: config.NODE_DEBUG ? '0' : '7d'
}))

app.get('*', (req, res) => {
  res.render('index', { req })
})

export { app }