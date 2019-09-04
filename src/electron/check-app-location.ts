import { IElectronConfig } from './config'
import { app, dialog } from 'electron'
import { from, of, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ok, fail, IResult, IEither, either } from 'typescript-monads'

const requestDialogResponse = () => dialog.showMessageBox({
  type: 'error',
  message: 'Move to Applications folder?',
  detail: `${app.name} must live in the Applications folder to be able to run correctly.`,
  buttons: [
    'Move to Applications folder',
    `Quit ${app.name}`
  ],
  defaultId: 0,
  cancelId: 1
})

export const isAppInCorrectLocation = (cfg: IElectronConfig) => app.isInApplicationsFolder() || cfg.IS_DEVELOPMENT ? true : false

export const enforceAppInstallLocation = (cfg: IElectronConfig): Observable<IResult<'OK', IEither<Boolean, Boolean>>> => {
  cfg.LOGGER.trace('Entered function:', 'enforceAppInstalLocation()')

  return isAppInCorrectLocation(cfg)
    ? of(ok<'OK', IEither<Boolean, Boolean>>('OK'))
    : from(requestDialogResponse()).pipe(
      map(a => fail<'OK', IEither<Boolean, Boolean>>(a.response === 1
        ? either<Boolean, Boolean>(true, undefined)
        : either<Boolean, Boolean>(undefined, true))))
}
