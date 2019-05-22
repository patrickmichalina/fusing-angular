import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'

const red = 'red'

@Component({
  selector: 'app-home',
  template: `<h3>{{ message }}</h3>`,
  styles: [`
    :host {
      background-color: ${red};
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  public message: string;

  ngOnInit() {
    this.message = 'Hello';
  }
}
