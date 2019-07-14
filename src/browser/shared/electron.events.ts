export type IPCMessageTuple = [keyof IAppIPCMessage, IAppIPCMessage[keyof IAppIPCMessage]]

// Extend this interface to make your event channel strongly typed
export interface IAppIPCMessage {
  readonly 'app-loaded': boolean
}
