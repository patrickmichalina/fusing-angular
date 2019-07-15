import { fromEvent, Subject, combineLatest } from 'rxjs'
import { take, share, filter, map, flatMap, shareReplay } from 'rxjs/operators'
import { app, BrowserWindow, ipcMain } from 'electron'
import { createWindow } from './window'
import { filterIPCMessages } from './util'
import { IAangularIPCMessageTuple } from '../browser/shared/electron.events'
import { menu$ } from './menus/shared'
import setChromiumFlags from './flags'

setChromiumFlags()

const windowSource = new Subject<BrowserWindow | undefined>()
export const window$ = windowSource.asObservable().pipe(shareReplay(1))

export const appReady$ = fromEvent(app, 'ready').pipe(share())
export const appActivate$ = fromEvent(app, 'activate').pipe(share())
export const appAllWindowsClosed$ = fromEvent(app, 'window-all-closed').pipe(share())
export const appAngularEvents$ = fromEvent(ipcMain, 'angular-messages').pipe(
  map((a: any[]) => [a[1], a[2]] as IAangularIPCMessageTuple), 
  share()
)

appAngularEvents$.pipe(filterIPCMessages('app-loaded')).subscribe(a => {
  console.log(a)
})

appReady$.pipe(
  flatMap(() => menu$),
  take(1)
  ).subscribe(() => {
  windowSource.next(createWindow().on('close', ()=> windowSource.next(undefined)))
})

appAllWindowsClosed$.pipe(filter(() => process.platform !== 'darwin')).subscribe(() => {
  app.quit()
})

combineLatest(appActivate$, window$.pipe(filter(a => a === undefined)))
  .subscribe(() => createWindow())
