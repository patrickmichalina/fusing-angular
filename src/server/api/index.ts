import * as compression from 'compression'
import { Application } from 'express'

export const registerApi = (app: Application) => {
  app.use('/api', compression())
  app.get('/api/notes', (req, res) => {
    res.header('Cache-Tag', 'Notes')
    return res.send(Array.from(Array(10).keys()).map(num => `Note ${num}`))
  })

  // app._router.stack.forEach(function (r) {
  //   if (r.route && r.route.path) {
  //     console.log(r.route)
  //   }
  // })
}
