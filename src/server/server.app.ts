import * as express from 'express'
import * as cookieParser from 'cookie-parser'
import { resolve } from 'path'
import { ngExpressEngine } from '@nguniversal/express-engine'
import { AppServerModule } from './server.angular.module'

const app = express()
const dir = resolve('./.dist')
const publicDir = `${dir}/public`

app.use(cookieParser())
app.use('/js', express.static(`${publicDir}/js`))
app.set('view engine', 'html')
app.set('views', publicDir)
app.engine('html', ngExpressEngine({ bootstrap: AppServerModule }))

app.get('*', (req, res) => {
  res.render('index', { req })
})


export { app }