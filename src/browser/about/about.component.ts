import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-about',
  template: `<h3>ABOUT 2PAGE</h3>`,
  styles: [`
    :host {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
}
