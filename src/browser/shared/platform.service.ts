import { Inject, Injectable, PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'

export interface IPlatformService {
  readonly isBrowser: boolean
  readonly isServer: boolean
}

@Injectable()
export class PlatformService implements IPlatformService {
  constructor(@Inject(PLATFORM_ID) private platformId: string) {}

  public readonly isBrowser = isPlatformBrowser(this.platformId)
  public readonly isServer = isPlatformServer(this.platformId)
  public readonly isElectron = this.platformId === 'electron'
}
