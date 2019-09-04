import { serverTestAgent } from "../test-server"

describe('/api/notes', () => {
  it('should', done => {
    serverTestAgent
      .get('/api/notes')
      .expect(200)
      .end(done)
  })
})