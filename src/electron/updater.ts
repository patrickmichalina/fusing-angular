import { autoUpdater } from 'electron-updater'
import { BrowserWindow } from 'electron'

export default function initAutoUpdater(win: BrowserWindow) {
  autoUpdater.on('checking-for-update', () => {
    // sendStatusToWindow('Checking for update...');
  })
  autoUpdater.on('update-available', (ev, info) => {
    // sendStatusToWindow('Update available.');
  })
  autoUpdater.on('update-not-available', (ev, info) => {
    // sendStatusToWindow('Update not available.');
  })
  autoUpdater.on('error', (ev, err) => {
    // sendStatusToWindow('Error in auto-updater.');
  })
  autoUpdater.on('download-progress', (ev, progressObj) => {
    // sendStatusToWindow('Download progress...');
  })
  autoUpdater.on('update-downloaded', (ev, info) => {
    // win.tapSome(w => {
    //   const opt: MessageBoxOptions = {
    //     type: 'question',
    //     buttons: ['Install', 'Later'],
    //     title: 'Update available',
    //     message: 'An update is available. Restart and install?'
    //   }
    //   dialog.showMessageBox(w, opt, choice => {
    //     if (choice !== 0) {
    //       return
    //     }
    //     setImmediate(() => {
    //       app.removeAllListeners('window-all-closed')
    //       BrowserWindow.getAllWindows().forEach(bw => bw.removeAllListeners('close'))
    //       autoUpdater.quitAndInstall(false)
    //     })
    //   })
    // })
  })
}
