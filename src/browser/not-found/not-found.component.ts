import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'not-found',
  template: 'NOT FOUND'
})
export class NotFoundComponent {
}
