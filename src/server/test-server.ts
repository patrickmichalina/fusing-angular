import { createExpressApplication } from "../../src/server/app"
import { agent } from "supertest"

export const HTTP_TEST_APP =
  createExpressApplication
    .run({
      CLUSTERED_WORKERS: 1,
      NODE_DEBUG: true,
      PORT: 4201,
      DIST_FOLDER: '.dist/wwwroot',
      WWW_ROOT: 'dist'
    })

export const serverTestAgent = agent(HTTP_TEST_APP)
