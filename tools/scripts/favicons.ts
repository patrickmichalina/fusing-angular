import * as sharp from 'sharp'
import { resolve } from 'path'

const basePath = resolve('src/assets/img/logo.png')
const runs = [
  { h: 16, w: 16 },
  { h: 32, w: 32 },
  { h: 48, w: 48 },
  { h: 52, w: 52 },
  { h: 57, w: 57 },
  { h: 72, w: 72 },
  { h: 76, w: 76 },
  { h: 96, w: 96 },
  { h: 114, w: 114 },
  { h: 120, w: 120 },
  { h: 128, w: 128 },
  { h: 144, w: 144 },
  { h: 152, w: 152 },
  { h: 180, w: 180 },
  { h: 192, w: 192 },
  { h: 384, w: 384 },
  { h: 512, w: 512 },
  { h: 1024, w: 1024 }
]

Promise.all(runs.map(r => sharp(basePath)
  .resize(r.w, r.h, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .toFile(`src/assets/icons/icon-${r.w}x${r.h}.png`)))