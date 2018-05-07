import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-root',
  template: `
    <div class="root">
    <h1>Test</h1>
    <a routerLink="/">Link 1</a>
    <a routerLink="/test">Link 2</a>
    <router-outlet></router-outlet>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
}