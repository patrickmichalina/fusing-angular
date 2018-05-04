import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div class="root">
  <h1>sdf</h1>
  <a routerLink="/">Hod  </a>
  <a routerLink="/test">test</a>
  <router-outlet></router-outlet>
  </div>
  
  `,
  styles: [`
  
  `]
})
export class AppComponent {
}