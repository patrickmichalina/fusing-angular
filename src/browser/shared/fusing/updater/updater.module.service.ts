import { Injectable, NgZone, Optional, Inject } from '@angular/core'
import { SwUpdate } from '@angular/service-worker'
import { interval, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { maybe } from 'typescript-monads'
import { UPDATER_INTERVAL } from './updater.tokens'

@Injectable()
export class UpdaterService {
  constructor(private zone: NgZone, @Inject(UPDATER_INTERVAL) private updateInterval: number,
    @Optional() private updates?: SwUpdate) { }

  listenForUpdates = () =>
    maybe(this.updates)
      .map(swUpdates => this.zone.runOutsideAngular(() => interval(this.updateInterval).pipe(
        switchMap(() => swUpdates.checkForUpdate()))))
      .valueOr(of())
}