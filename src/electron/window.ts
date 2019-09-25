import { format } from 'url'
import { BrowserWindow } from 'electron'
import { reader } from 'typescript-monads'
import { IElectronConfig } from './config'
import { initInterceptFileProtocol } from './protocol'

export const initWindow = initInterceptFileProtocol
  .flatMap(() => reader<IElectronConfig, BrowserWindow>(cfg => {
  const win = new BrowserWindow({
    center: true,
    width: 800,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      autoplayPolicy: 'no-user-gesture-required',
      devTools: cfg.IS_DEVELOPMENT
    }
  })

  // and load the index.html of the app.
  win.loadURL(
    format({
      pathname: 'index.html',
      protocol: 'file:',
      slashes: true
    })
  )

  if (cfg.IS_DEVELOPMENT) {
    win.webContents.openDevTools() // Open the DevTools.
  } else {
    // TODO PROD ONLY SETUP
  }

  return win
}))



