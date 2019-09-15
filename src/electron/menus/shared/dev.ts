import { IElectronConfig } from "../../config"

export const devMenu = (cfg: IElectronConfig) => {
  return {
    label: 'Development Tools',
    submenu: []
  }
}