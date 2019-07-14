import { fromEvent, Subject, combineLatest } from 'rxjs'
import { take, share, filter, shareReplay } from 'rxjs/operators'
import { app, BrowserWindow } from 'electron'
import { createWindow } from './window'
import setChromiumFlags from './flags'

setChromiumFlags()

const windowSource = new Subject<BrowserWindow | undefined>()
const window$ = windowSource.asObservable().pipe(shareReplay(1))

export const appReady$ = fromEvent(app, 'ready').pipe(share())
export const appActivate$ = fromEvent(app, 'activate').pipe(share())
export const appAllWindowsClosed$ = fromEvent(app, 'window-all-closed').pipe(share())

appReady$.pipe(take(1)).subscribe(() => {
  windowSource.next(createWindow().on('close', ()=> windowSource.next(undefined)))
})

appAllWindowsClosed$.pipe(filter(() => process.platform !== 'darwin')).subscribe(() => {
  app.quit()
})

combineLatest(appActivate$, window$.pipe(filter(a => a === undefined)))
  .subscribe(() => createWindow())
