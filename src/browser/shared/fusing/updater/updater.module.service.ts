import { Injectable, Optional, Inject, ApplicationRef } from '@angular/core'
import { SwUpdate } from '@angular/service-worker'
import { interval, of } from 'rxjs'
import { switchMap, filter, first } from 'rxjs/operators'
import { maybe } from 'typescript-monads'
import { UPDATER_INTERVAL } from './updater.tokens'
import { PlatformService } from '../platform.service'

@Injectable()
export class UpdaterService {
  constructor(private appRef: ApplicationRef, private ps: PlatformService, @Inject(UPDATER_INTERVAL) private updateInterval: number,
    @Optional() private updates?: SwUpdate) { }

  listenForUpdates = () =>
    maybe(this.updates)
      .filter(() => this.ps.isBrowser)
      .map(swUpdates => this.appRef.isStable.pipe(
        filter(Boolean),
        first(),
        switchMap(() => interval(this.updateInterval).pipe(
          switchMap(() => swUpdates.checkForUpdate()))
        )))
      .valueOr(of())
}