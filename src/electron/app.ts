import { fromEvent, Subject, combineLatest } from 'rxjs'
import { take, share, filter, map } from 'rxjs/operators'
import { app, BrowserWindow, ipcMain } from 'electron'
import { createWindow } from './window'
import setChromiumFlags from './flags'
import { Message } from '../browser/shared/electron.service'

setChromiumFlags()

const windowSource = new Subject<BrowserWindow | undefined>()
const window$ = windowSource.asObservable().pipe(share())

export const appReady$ = fromEvent(app, 'ready').pipe(share())
export const appActivate$ = fromEvent(app, 'activate').pipe(share())
export const appAllWindowsClosed$ = fromEvent(app, 'window-all-closed').pipe(share())
export const appAngularEvents$ = fromEvent(ipcMain, 'angular-messages').pipe(
  map((a: any[]) => [a[1], a[2]] as [keyof Message, Message[keyof Message]]), 
  share()
)

appAngularEvents$.pipe(
  filter(a => a[0] === 'app-loaded'),
  map(a => a[1] as Message['app-loaded'])
  ).subscribe(a => a)

appReady$.pipe(take(1)).subscribe(() => {
  windowSource.next(createWindow().on('close', ()=> windowSource.next(undefined)))
})

appAllWindowsClosed$.pipe(filter(() => process.platform !== 'darwin')).subscribe(() => {
  app.quit()
})

combineLatest(appActivate$, window$.pipe(filter(a => a === undefined)))
  .subscribe(() => createWindow())
