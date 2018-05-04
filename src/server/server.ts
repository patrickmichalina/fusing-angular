import { createServer } from 'http'
import { expressApp } from './server.app'
import { PORT } from '../config';

const port = PORT
const server = createServer(expressApp)

server.listen(port, () => {
    console.log('Angular Universal Server listening')
})
