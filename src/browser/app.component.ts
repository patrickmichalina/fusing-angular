import { Component, ChangeDetectionStrategy, Renderer2 } from '@angular/core'
import { AppInitService } from './shared/fusing/app-init.service'

@Component({
  selector: 'pm-app',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(rdr: Renderer2, ais: AppInitService) {
    ais.init(rdr)
  }

  public param = { value: 'John' }
  public en = { lang: 'en' }
  public jp = { lang: 'jp' }
}
