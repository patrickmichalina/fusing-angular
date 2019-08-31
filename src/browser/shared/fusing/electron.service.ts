import { Injectable } from '@angular/core'
import { IMaybe, maybe } from 'typescript-monads'
import { IAangularIPCMessage, IElectronIPCMessage, IElectronIPCMessageTuple } from './electron.events'
import { Observable, empty } from 'rxjs'
import * as Fs from 'fs'
import * as Path from 'path'
import * as Electron from 'electron'
import * as ChildProcess from 'child_process'

export interface IElectronService {
  readonly fs: IMaybe<typeof Fs>
  readonly path: IMaybe<typeof Path>
  readonly childProcess: IMaybe<typeof ChildProcess>
  readonly electron: IMaybe<typeof Electron>
  readonly ipcRenderer: IMaybe<typeof Electron.ipcRenderer>
  readonly webFrame: IMaybe<typeof Electron.webFrame>
  readonly remote: IMaybe<typeof Electron.remote>
  readonly clipboard: IMaybe<typeof Electron.clipboard>
  readonly crashReporter: IMaybe<typeof Electron.crashReporter>
  readonly desktopCapturer: IMaybe<typeof Electron.desktopCapturer>
  readonly nativeImage: IMaybe<typeof Electron.nativeImage>
  readonly shell: IMaybe<typeof Electron.shell>

  readonly sendMsgToElectron:
    <TMessageType extends keyof IAangularIPCMessage, TMessage extends IAangularIPCMessage[TMessageType]>
      (type: TMessageType, message: TMessage) => void
  
  readonly electronMessages$: () => Observable<IElectronIPCMessageTuple>
  readonly electronMessage$: <TMessageType extends keyof IElectronIPCMessage, TMessage extends IElectronIPCMessage[TMessageType]>
    (type: TMessageType) => Observable<TMessage>
}

@Injectable()
export class ElectronService implements IElectronService {
  public readonly fs = maybe<typeof Fs>()
  public readonly path = maybe<typeof Path>()
  public readonly childProcess = maybe<typeof ChildProcess>()
  public readonly electron = maybe<typeof Electron>()
  public readonly ipcRenderer = maybe<typeof Electron.ipcRenderer>()
  public readonly webFrame = maybe<typeof Electron.webFrame>()
  public readonly remote = maybe<typeof Electron.remote>()
  public readonly clipboard = maybe<typeof Electron.clipboard>()
  public readonly crashReporter = maybe<typeof Electron.crashReporter>()
  public readonly desktopCapturer = maybe<typeof Electron.desktopCapturer>()
  public readonly nativeImage = maybe<typeof Electron.nativeImage>()
  public readonly shell = maybe<typeof Electron.shell>()
  public readonly sendMsgToElectron = <TMessageType extends keyof IAangularIPCMessage, TMessage extends IAangularIPCMessage[TMessageType]>(type: TMessageType, message: TMessage) => { }
  public readonly electronMessage$ = <TMessageType extends keyof IElectronIPCMessage, TMessage extends IElectronIPCMessage[TMessageType]>(type: TMessageType) => empty()
  public readonly electronMessages$ = () => empty()
}
