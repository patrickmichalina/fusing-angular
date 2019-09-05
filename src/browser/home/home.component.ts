import { Component, ChangeDetectionStrategy } from '@angular/core'
import { NodeEnvTransferService } from '@flosportsinc/ng-env-transfer-state'
import { HttpClient } from '@angular/common/http'
import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  constructor(public env: NodeEnvTransferService, private http: HttpClient) { }

  public notesInternal$ = this.http.get<any[]>('api/notes').pipe(catchError(_ => of<any[]>([])))
  public notesExternal$ = this.http.get<any[]>('https://jsonplaceholder.typicode.com/posts')
}
