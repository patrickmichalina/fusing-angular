// import { autoUpdater, AppUpdater } from 'electron-updater'
import { BrowserWindow } from 'electron'
import { reader } from 'typescript-monads'
import { IElectronConfig } from './config'

export const initAutoUpdater = (win: BrowserWindow) => reader<IElectronConfig, any>(cfg => {
  const log = cfg.LOGGER.child({ ns: 'initAutoUpdater()' })
  log.trace('entered function')
  
  // autoUpdater.on('checking-for-update', () => {
  //   log.info('checking-for-update')
  //   // sendStatusToWindow('Checking for update...');
  // })
  // autoUpdater.on('update-available', (ev, info) => {
  //   log.info('update-available')
  //   // sendStatusToWindow('Update available.');
  // })
  // autoUpdater.on('update-not-available', (ev, info) => {
  //   log.info('update-not-available')
  //   // sendStatusToWindow('Update not available.');
  // })
  // autoUpdater.on('error', (ev, err) => {
  //   log.error(err)
  //   // sendStatusToWindow('Error in auto-updater.');
  // })
  // autoUpdater.on('download-progress', (ev, progressObj) => {
  //   log.info('update-downloaded', progressObj)
  //   // sendStatusToWindow('Download progress...');
  // })
  // autoUpdater.on('update-downloaded', (ev, info) => {
  //   log.info('update-downloaded')
  //   // win.tapSome(w => {
  //   //   const opt: MessageBoxOptions = {
  //   //     type: 'question',
  //   //     buttons: ['Install', 'Later'],
  //   //     title: 'Update available',
  //   //     message: 'An update is available. Restart and install?'
  //   //   }
  //   //   dialog.showMessageBox(w, opt, choice => {
  //   //     if (choice !== 0) {
  //   //       return
  //   //     }
  //   //     setImmediate(() => {
  //   //       app.removeAllListeners('window-all-closed')
  //   //       BrowserWindow.getAllWindows().forEach(bw => bw.removeAllListeners('close'))
  //   //       autoUpdater.quitAndInstall(false)
  //   //     })
  //   //   })
  //   // })
  // })
  return {}
})
