import { Injectable } from '@angular/core'
import { NodeEnvTransferService } from '@flosportsinc/ng-env-transfer-state'
import { maybe, IMaybe } from 'typescript-monads'

// change me to fit your application
export interface IEnvironment {
  readonly APP_VERSION: string
  readonly NODE_DEBUG: string
}

export interface IEnvironmentService {
  readonly config: IEnvironment
  readonly maybeGet: (key: keyof IEnvironment) => IMaybe<string>
  readonly maybeGetAsNumber: (key: keyof IEnvironment) => IMaybe<number>
}

@Injectable()
export class EnvironmentService implements IEnvironmentService {
  constructor(private _nts: NodeEnvTransferService<IEnvironment>) { }

  readonly config = this._nts.env

  maybeGet = (key: keyof IEnvironment) => maybe(this.config[key])

  maybeGetAsNumber = (key: keyof IEnvironment) => this.maybeGet(key)
    .map(b => +b)
    .filter(b => !isNaN(b))

  maybeGetAsBoolean = (key: keyof IEnvironment) => this.maybeGet(key)
    .map(b => b === 'false' ? false : b === 'true' ? true : b)
    .filter(a => typeof a === 'boolean')
}
