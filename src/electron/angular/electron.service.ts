import { Injectable } from '@angular/core'
import { EMPTY, fromEvent } from 'rxjs'
import { map, filter } from 'rxjs/operators'
import { PlatformService } from '../../browser/shared/fusing/platform.service'
import { IAangularIPCMessage, IElectronIPCMessageTuple, IElectronIPCMessage } from '../../browser/shared/fusing/electron.events'
import { IElectronService } from '../../browser/shared/fusing/electron.service'
import * as Fs from 'fs'
import * as Path from 'path'
import * as Electron from 'electron'
import * as ChildProcess from 'child_process'

const mapToRequire = (name: string) => (func: Function) => func(name)

@Injectable()
export class ElectronServerService implements IElectronService {
  constructor(private ps: PlatformService) { }

  private readonly maybeRequireFunc = this.ps.maybeElectronRenderer.map<Function>(w => w.require)
  private readonly easyMap = <T>(name: string) => this.maybeRequireFunc.map<T>(mapToRequire(name))

  public readonly fs = this.easyMap<typeof Fs>('fs')
  public readonly path = this.easyMap<typeof Path>('path')
  public readonly childProcess = this.easyMap<typeof ChildProcess>('child_process')
  public readonly electron = this.easyMap<typeof Electron>('electron')
  public readonly ipcRenderer = this.electron.map(e => e.ipcRenderer)
  public readonly webFrame = this.electron.map(e => e.webFrame)
  public readonly remote = this.electron.map(e => e.remote)
  public readonly clipboard = this.electron.map(e => e.clipboard)
  public readonly crashReporter = this.electron.map(e => e.crashReporter)
  public readonly desktopCapturer = this.electron.map(e => e.desktopCapturer)
  public readonly nativeImage = this.electron.map(e => e.nativeImage)
  public readonly shell = this.electron.map(e => e.shell)

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
