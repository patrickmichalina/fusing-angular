import { serverTestAgent } from "../../../tools/test/http-tests"

describe('/api/notes', () => {
  it('should', done => {
    serverTestAgent
      .get('/api/notes')
      .expect(200)
      .end(done)
  })
})