import { Component, ChangeDetectionStrategy, Renderer2 } from '@angular/core'
import { AppInitService } from '../shared/fusing/app-init.service'
import { LoggingService } from '../shared/fusing/logging/logging.service';

@Component({
  selector: 'pm-site',
  styleUrls: ['./site.component.css'],
  templateUrl: './site.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteComponent {
  constructor(rdr: Renderer2, ais: AppInitService) {
    ais.init(rdr)
  }

  public param = { value: 'John' }
  public en = { lang: 'en' }
  public jp = { lang: 'jp' }
}
