import { maybe } from "typescript-monads"
import { IAangularIPCMessage, IAangularIPCMessageTuple, IElectronIPCMessage } from "../browser/shared/fusing/electron.events"
import { Observable } from "rxjs"
import { map, filter } from "rxjs/operators"
import { BrowserWindow } from "electron"

export const isElectronDev = () => maybe(process.mainModule).filter(a => a.filename.includes('app.asar')).isNone()

export const filterIPCMessages = <TMessageType extends keyof IAangularIPCMessage, TMessage extends IAangularIPCMessage[TMessageType]>(type: TMessageType) =>
  (source: Observable<IAangularIPCMessageTuple>) =>
    source.pipe(
      filter(a => a[0] === type),
      map(a => a[1] as TMessage))

export const sendAngularMessage =
  <TMessageType extends keyof IElectronIPCMessage, TMessage extends IElectronIPCMessage[TMessageType]>(window: BrowserWindow, type: TMessageType, message: TMessage) =>
    window.webContents.send('electron-messages', type, message)