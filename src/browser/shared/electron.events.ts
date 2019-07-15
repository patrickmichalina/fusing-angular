export type IAangularIPCMessageTuple = [keyof IAangularIPCMessage, IAangularIPCMessage[keyof IAangularIPCMessage]]
export type IElectronIPCMessageTuple = [keyof IElectronIPCMessage, IElectronIPCMessage[keyof IElectronIPCMessage]]

// extend these interfaces to strongly type your event channels 
export interface IAangularIPCMessage {
  readonly 'app-loaded': boolean
}

export interface IElectronIPCMessage {
  readonly 'log': string
  readonly 'change-language': string
}