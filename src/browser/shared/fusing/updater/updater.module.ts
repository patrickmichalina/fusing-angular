import { NgModule } from '@angular/core'
import { UpdaterService } from './updater.module.service'
import { UPDATE_INTERVAL } from './updater.tokens'

@NgModule({
  providers: [
    UpdaterService,
    { provide: UPDATE_INTERVAL, useValue: 1 * 60 * 1000 }
  ]
})
export class UpdaterModule {
  constructor(us: UpdaterService) {
    us.listenForUpdates().subscribe()
  }
 }