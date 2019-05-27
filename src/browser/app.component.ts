import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-root',
  template: `
    <div class="root">
    <h1>Test!</h1>
    <ul>
      <li><a routerLink>HOME2</a></li>
      <li><a routerLink="/about">ABOUT</a></li>
    </ul>
    <router-outlet></router-outlet>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
}