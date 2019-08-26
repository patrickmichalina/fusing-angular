import { createExpressApplication } from "../../src/server/app"
import { agent } from "supertest"

export const HTTP_TEST_APP =
  createExpressApplication
    .run({
      CLUSTERED_WORKERS: 1,
      NODE_DEBUG: true,
      PORT: 4202,
      DIST_FOLDER: 'dist',
      WWW_ROOT: 'dist/wwwroot'
    })

export const serverTestAgent = agent(HTTP_TEST_APP)
