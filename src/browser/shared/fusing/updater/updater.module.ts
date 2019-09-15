import { NgModule, Optional, Inject } from '@angular/core'
import { UpdaterService } from './updater.module.service'
import { UPDATER_INTERVAL, TPromptFn, UPDATER_UPDATER_FN, UPDATER_PROMPT_FN, TUpdaterFn } from './updater.tokens'
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker'
import { LoggingService } from '../logging/logging.service'
import { of } from 'rxjs'
import { switchMap, filter, first } from 'rxjs/operators'

export function prompt(log: LoggingService): TPromptFn {
  return function (evt: UpdateAvailableEvent) {
    log.info('current version is', evt.current)
    log.info('available version is', evt.available)

    const response = window.confirm('An update is available, install now?')

    return of(response)
  }
}

export function updater(): TUpdaterFn {
  return function () {
    document.location.reload()
  }
}

@NgModule({
  providers: [
    UpdaterService,
    { provide: UPDATER_INTERVAL, useValue: 1 * 60 * 1000 },
    { provide: UPDATER_PROMPT_FN, useFactory: prompt, deps: [LoggingService] },
    { provide: UPDATER_UPDATER_FN, useFactory: updater }
  ]
})
export class UpdaterModule {
  constructor(us: UpdaterService, @Inject(UPDATER_PROMPT_FN) prompt: TPromptFn,
  @Inject(UPDATER_UPDATER_FN) updater: TUpdaterFn, @Optional() updates: SwUpdate) {

    if (!updates) return

    updates.available.pipe(
      switchMap(evt => prompt(evt)),
      filter(Boolean),
      switchMap(() => updates.activateUpdate()),
      first()).subscribe(() => updater())

    us.listenForUpdates().subscribe()
  }
}