import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-about',
  template: `<h3>ABOUT</h3>`,
  styles: [`
    :host {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
}
