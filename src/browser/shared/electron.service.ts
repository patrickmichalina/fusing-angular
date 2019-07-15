import { Injectable } from '@angular/core'
import { maybe } from 'typescript-monads'
import { PlatformService } from './platform.service'
import { IAangularIPCMessage, IElectronIPCMessage, IElectronIPCMessageTuple } from './electron.events'
import { EMPTY, fromEvent } from 'rxjs'
import { map, filter } from 'rxjs/operators'
import * as fs from 'fs'
import * as Electron from 'electron'
import * as ChildProcess from 'child_process'

type RequireWindow = Window & { process: any, require: any }

const mapToRequire = (name: string) => (func: Function) => func(name)

@Injectable()
export class ElectronService {
  constructor(private ps: PlatformService) { }

  private readonly maybeRequireFunc = !this.ps.isElectron
    ? maybe<Function>()
    : maybe(window as RequireWindow)
      .flatMap(w => maybe(w.process)
        .filter(p => p.type === 'renderer')
        .map<Function>(_ => w.require))

  private readonly easyMap = <T>(name: string) => this.maybeRequireFunc.map<T>(mapToRequire(name))

  public readonly fs = this.easyMap<typeof fs>('fs')
  public readonly childProcess = this.easyMap<typeof ChildProcess>('child_process')
  public readonly electron = this.easyMap<typeof Electron>('electron')
  public readonly ipcRenderer = this.electron.map(e => e.ipcRenderer)
  public readonly webFrame = this.electron.map(e => e.webFrame)
  public readonly remote = this.electron.map(e => e.remote)
  public readonly clipboard = this.electron.map(e => e.clipboard)
  public readonly crashReporter = this.electron.map(e => e.crashReporter)
  public readonly desktopCapturer = this.electron.map(e => e.desktopCapturer)
  public readonly nativeImage = this.electron.map(e => e.desktopCapturer)
  public readonly shell = this.electron.map(e => e.desktopCapturer)

  public readonly sendMsgToElectron =
    <TMessageType extends keyof IAangularIPCMessage, TMessage extends IAangularIPCMessage[TMessageType]>(type: TMessageType, message: TMessage) =>
      this.ipcRenderer.tapSome(a => a.send('angular-messages', type, message))

  public readonly electronMessages$ = () => this.ipcRenderer.match({
    none: () => EMPTY,
    some: ipc => fromEvent(ipc, 'electron-messages').pipe(map((a: any) => [a[1], a[2]] as IElectronIPCMessageTuple))
  })

  public readonly electronMessage$ = <TMessageType extends keyof IElectronIPCMessage, TMessage extends IElectronIPCMessage[TMessageType]>(type: TMessageType) =>
    this.electronMessages$().pipe(
      filter(a => a[0] === type),
      map(a => a[1] as TMessage)
    )
}
