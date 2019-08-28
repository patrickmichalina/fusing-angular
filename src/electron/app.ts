import { fromEvent, Observable, Subject } from 'rxjs'
import { take, share, filter, map, shareReplay, takeUntil, flatMap, mergeMapTo, switchMap } from 'rxjs/operators'
import { filterIPCMessages } from './util'
import { initMenu } from './menus/shared'
import { setChromiumFlags } from './flags'
import { initWindow } from './window'
import { reader } from 'typescript-monads'
import { initCrashReporter } from './crash-reporter'
import { IAangularIPCMessageTuple } from '../browser/shared/fusing/electron.events'
import { enforceAppInstallLocation } from './check-app-location'
import { ELECTRON_CONFIG, IElectronConfig } from './config'
import { app as electron, BrowserWindow, ipcMain, dialog, clipboard } from 'electron'
import { initAutoUpdater } from './updater'
import * as cleanStack from 'clean-stack'

const app = () => reader<IElectronConfig, void>(cfg => {
  const log = cfg.LOGGER.child({ ns: 'app()' })
  log.trace('Entered function')

  const windowSource = new Subject<BrowserWindow>()
  const window$ = windowSource.asObservable().pipe(shareReplay(1))
  const appReady$ = fromEvent(electron, 'ready').pipe(shareReplay(1))
  const browserWindowCrashed$ = fromEvent<Electron.Event>(electron, 'renderer-process-crashed').pipe(share())
  const appActivate$ = fromEvent(electron, 'activate').pipe(share())
  const beforeQuit$ = fromEvent(electron, 'before-quit').pipe(share())
  const appQuit$ = fromEvent(electron, 'quit').pipe(share())
  const appAllWindowsClosed$ = fromEvent(electron, 'window-all-closed').pipe(share())
  const appAngularEvents$ = fromEvent(ipcMain, 'angular-messages').pipe(
    map((a: any[]) => [a[1], a[2]] as IAangularIPCMessageTuple),
    shareReplay(1)
  )

  const takeOnce = <T>(source: Observable<T>) => source.pipe(take(1))
  const takeUntilAppQuit = <T>(source: Observable<T>) => source.pipe(takeUntil(appQuit$))
  const filterBoolean = <T>(source: Observable<T>) => source.pipe(filter<NonNullable<T>>(Boolean))
  const filterPlatformOSX = <T>(source: Observable<T>) => source.pipe(filter<T>(() => cfg.IS_PLATFORM_OSX))
  const createWindow = () => windowSource.next(initWindow().run(cfg))

  appAngularEvents$.pipe(filterIPCMessages('log')).subscribe(a => {
    switch (a.type) {
      case 'trace': cfg.LOGGER_RDR.trace({ msg: a.msg })
        break
      case 'info': cfg.LOGGER_RDR.info({ msg: a.msg })
        break
      case 'warn': cfg.LOGGER_RDR.warn({ msg: a.msg })
        break
      case 'error': cfg.LOGGER_RDR.error({ msg: a.msg })
        break
      case 'fatal': cfg.LOGGER_RDR.fatal({ msg: a.msg })
        break
    }
  })

  window$.pipe(filterBoolean, flatMap(a => initMenu(a).run(cfg))).subscribe()

  appReady$.pipe(takeOnce, switchMap(() => enforceAppInstallLocation(cfg))).subscribe(res => {
    if (res.isOk()) {
      createWindow()
    } else if (res.unwrapFail().isLeft()) {
      electron.quit()
    } else {
      electron.moveToApplicationsFolder()
    }
  })

  window$.pipe(takeUntilAppQuit).subscribe(w => {
    initAutoUpdater(w).run(cfg)
      .checkForUpdatesAndNotify()
      .then()
      .catch(cfg.LOGGER.error)
  })

  appAllWindowsClosed$.pipe(filter(() => !cfg.IS_PLATFORM_OSX)).subscribe(() => {
    electron.quit()
  })

  appActivate$.pipe(mergeMapTo(window$), filterBoolean, takeUntilAppQuit).subscribe(win => {
    win.show()
  })

  // bindNodeCallback(process.on)('unhandledRejection').subscribe(console.log)
  appReady$.pipe(flatMap(_ => fromEvent<[Error, string]>(process, 'uncaughtException').pipe(map(a => a[0])))).subscribe(err => {
    log.fatal(err)
    const buttons = [
      'OK',
      process.platform === 'darwin' ? 'Copy Error' : 'Copy error',
      'Report...'
    ]
    const title = 'Error'
    const message = 'A fatal error occurred'
    dialog.showMessageBox({
      type: 'error',
      buttons,
      defaultId: 0,
      noLink: true,
      message,
      title,
      detail: cleanStack((err as any).stack, { pretty: true })
    }).then(v => {
      if (v.response === 1) {
        clipboard.writeText(`${err.stack}`)
      }
    })
  })

  const windowClosed$ = window$.pipe(filterBoolean, flatMap(w => fromEvent<Electron.Event>(w, 'close')), shareReplay(1))
  const windowClosedOSX$ = windowClosed$.pipe(filterPlatformOSX)

  windowClosedOSX$
    .pipe(takeUntil(beforeQuit$))
    .subscribe(e => {
      e.preventDefault();
      (e as Electron.Event & { sender: BrowserWindow }).sender.hide()
    })

  browserWindowCrashed$.subscribe(err => {
    log.fatal(err)
    electron.quit()
  })
})

setChromiumFlags()
  .flatMap(initCrashReporter)
  .flatMap(app)
  .run(ELECTRON_CONFIG)
