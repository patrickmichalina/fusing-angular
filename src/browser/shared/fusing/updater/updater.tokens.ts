import { InjectionToken } from '@angular/core'
import { UpdateAvailableEvent } from '@angular/service-worker'
import { Observable } from 'rxjs'

export type TUpdaterFn = () => void
export type TPromptFn = (evt: UpdateAvailableEvent) => Observable<boolean>

export const UPDATER_INTERVAL = new InjectionToken<number>('pm.updater.interval')
export const UPDATER_PROMPT_FN = new InjectionToken<TPromptFn>('pm.updater.prompt')
export const UPDATER_UPDATER_FN = new InjectionToken<TUpdaterFn>('pm.updater.update')