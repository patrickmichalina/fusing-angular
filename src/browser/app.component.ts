import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-root',
  template: `
    <div class="root">
    <h1>Tes2t</h1>
    <a routerLink>HOME</a>
    <a routerLink="/test">TEST</a>
    <router-outlet></router-outlet>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
}