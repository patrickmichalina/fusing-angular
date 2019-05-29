import * as express from 'express'
import * as cookieParser from 'cookie-parser'
import { resolve } from 'path'
import { ngExpressEngine } from '@nguniversal/express-engine'
import { AppServerModule } from './server.angular.module'

const app = express()
const dir = resolve('dist')
const publicDir = `${dir}/public`
const jsDir = `${publicDir}/js`
const expressStaticGzip = require('express-static-gzip')

app.use(cookieParser())
app.use('/js', expressStaticGzip(jsDir, {
  enableBrotli: true,
  orderPreference: ['br', 'gzip'] as ReadonlyArray<string>,
  // maxAge: config.NODE_DEBUG ? '0' : '7d'
}))

app.set('view engine', 'html')
app.set('views', publicDir)

app.engine('html', ngExpressEngine({ bootstrap: AppServerModule }))

app.get('*', (req, res) => {
  res.render('index', { req })
})

export { app }