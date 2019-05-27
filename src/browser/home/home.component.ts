import { Component, ChangeDetectionStrategy } from '@angular/core'

const red = 'red'

@Component({
  selector: 'app-home',
  template: `<h3>THIS IS HOME2222!</h3>`,
  styles: [`
    :host {
      background-color: ${red};
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent { }
