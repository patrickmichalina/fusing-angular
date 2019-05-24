import { Plugin, BundleProducer } from 'fuse-box'
import { gzip, ZlibOptions, brotliCompress } from 'zlib'
import { bindNodeCallback, forkJoin } from 'rxjs'
import { Observable } from 'rxjs'
import { flatMap } from 'rxjs/operators'
import { readFile } from 'fs'

// tslint:disable:no-class
// tslint:disable:no-this
// tslint:disable:no-if-statement
// tslint:disable:no-object-mutation
// tslint:disable:readonly-keyword
const defaults: CompressionPluginOptions = {
  enabled: true
}

const readFile_ = (path: string) => bindNodeCallback(readFile)(path)

export interface CompressionPluginOptions {
  enabled?: boolean
  fileTest?: string
}

function gzip_(buffer: Buffer, options?: ZlibOptions) {
  return (<any>bindNodeCallback(gzip))(buffer, options) as Observable<Buffer>
}

function brotli_(buffer: Buffer) {
  return bindNodeCallback(brotliCompress)(buffer)
}

export class CompressionPluginClass implements Plugin {
  constructor(public opts: CompressionPluginOptions = defaults) {
    this.opts = {
      ...defaults,
      ...opts
    }
  }
  producerEnd?(producer: BundleProducer): any {
    return forkJoin(
      Array.from(producer.bundles)
        .map(bundle => bundle[1].context.output)
        .map(bundleOutput => {
          return readFile_(bundleOutput.lastWrittenPath).pipe(
            flatMap(file => {
              return forkJoin([
                gzip_(file, { level: 9 }).pipe(
                  flatMap(compressed =>
                    bundleOutput.writeToOutputFolder(
                      `${bundleOutput.lastPrimaryOutput.relativePath}.gzip`,
                      compressed
                    )
                  )
                ),
                brotli_(file).pipe(
                  flatMap(compressed =>
                    bundleOutput.writeToOutputFolder(
                      `${bundleOutput.lastPrimaryOutput.relativePath}.br`,
                      compressed
                    )
                  )
                )
              ])
            })
          )
        })
    ).toPromise()
  }
}

export const CompressionPlugin = (options?: CompressionPluginOptions) =>
  new CompressionPluginClass(options)
