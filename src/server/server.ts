import { createServer } from 'http'
import { app } from './server.app'
import { PORT } from '../config';

const port = PORT
const server = createServer(app)

server.listen(port, () => {
  console.log('Angular Universal Server listening')
})
