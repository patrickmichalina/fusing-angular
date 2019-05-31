import { Component, ChangeDetectionStrategy } from '@angular/core'
import { NodeEnvTransferService } from '@flosportsinc/ng-env-transfer-state'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-home',
  template: `<h3>HOME</h3>
    <h3>Internal API Request</h3>
    <ul>
     <li *ngFor="let item of notesInternal$ | async">{{ item }}</li>
    </ul>

    <h3>External API Request</h3>
    <ul>
      <li *ngFor="let item of notesExternal$ | async">{{ item.title }}</li>
    </ul>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  constructor(public env: NodeEnvTransferService, private http: HttpClient) { }

  public notesInternal$ = this.http.get('api/notes')
  public notesExternal$ = this.http.get('https://jsonplaceholder.typicode.com/posts')
}
