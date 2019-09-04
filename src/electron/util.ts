import { IAangularIPCMessage, IAangularIPCMessageTuple, IElectronIPCMessage } from "../browser/shared/fusing/electron.events"
import { Observable } from "rxjs"
import { map, filter } from "rxjs/operators"
import { BrowserWindow, app } from "electron"
import { resolve } from "path"

export const getExecutionBasePath = resolve(app.getAppPath().replace('app.asar', 'app.asar.unpacked'))
export const getExecutionPath = (str: string) => resolve(getExecutionBasePath, str)

export const filterIPCMessages = <TMessageType extends keyof IAangularIPCMessage, TMessage extends IAangularIPCMessage[TMessageType]>(type: TMessageType) =>
  (source: Observable<IAangularIPCMessageTuple>) =>
    source.pipe(
      filter(a => a[0] === type),
      map(a => a[1] as TMessage))

export const sendAngularMessage =
  <TMessageType extends keyof IElectronIPCMessage, TMessage extends IElectronIPCMessage[TMessageType]>(window: BrowserWindow, type: TMessageType, message: TMessage) =>
    window.webContents.send('electron-messages', type, message)