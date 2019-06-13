import { app } from 'electron'

export default function setChromiumFlags() {
  // example: to let videos autoplay without initial input
  app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')
}
