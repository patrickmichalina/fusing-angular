import { Inject, Injectable, PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'
import { maybe } from 'typescript-monads'

export interface IPlatformService {
  readonly isBrowser: boolean
  readonly isServer: boolean
}

type RequireWindow = Window & { process: any, require: any }

@Injectable()
export class PlatformService implements IPlatformService {
  constructor(@Inject(PLATFORM_ID) private platformId: string) { }

  public readonly isBrowser = isPlatformBrowser(this.platformId)
  public readonly isServer = isPlatformServer(this.platformId)
  public readonly maybeElectronRenderer = this.isServer
    ? maybe<RequireWindow>()
    : maybe(window as RequireWindow)
      .flatMap(w => maybe(w.process)
        .filter(p => p.type === 'renderer')
        .map(() => w))

  public readonly isElectron = this.maybeElectronRenderer.isSome()
}
