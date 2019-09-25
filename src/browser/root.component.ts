import { Component, ChangeDetectionStrategy, Renderer2 } from '@angular/core'
import { AppInitService } from './shared/fusing/app-init.service'

@Component({
  selector: 'pm-root',
  styleUrls: ['./root.component.css'],
  templateUrl: './root.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RootComponent {
  constructor(rdr: Renderer2, ais: AppInitService) {
    ais.init(rdr)
  }
}
