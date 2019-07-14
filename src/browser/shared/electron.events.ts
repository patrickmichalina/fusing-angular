export type IPCMessageTuple = [keyof IAangularIPCMessage, IAangularIPCMessage[keyof IAangularIPCMessage]]

// Extend these interfaces to make your event channels strongly typed
export interface IAangularIPCMessage {
  readonly 'app-loaded': boolean
  readonly 'test': string
}

export interface IElectronIPCMessage {
  readonly 'log': string
  readonly 'thing': number
}