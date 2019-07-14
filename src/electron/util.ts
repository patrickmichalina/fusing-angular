import { maybe } from "typescript-monads"
import { IAppIPCMessage, IPCMessageTuple } from "../browser/shared/electron.events"
import { Observable } from "rxjs"
import { map, filter } from "rxjs/operators"

export const isElectronDev = () => maybe(process.mainModule).filter(a => a.filename.includes('app.asar')).isNone()

export const filterIPCMessages =
  (type: keyof IAppIPCMessage) =>
    (source: Observable<IPCMessageTuple>) =>
      source.pipe(
        filter(a => a[0] === type),
        map(a => a[1] as IAppIPCMessage[keyof IAppIPCMessage]))
