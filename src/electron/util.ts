import { maybe } from "typescript-monads"

export const isElectronDev = () => maybe(process.mainModule).filter(a => a.filename.includes('app.asar')).isNone()