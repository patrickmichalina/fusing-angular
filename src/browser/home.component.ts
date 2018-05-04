import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  template: `<h3>{{ message }}</h3>`,
  // styleUrls: ['./home.component.css'],
  styles: [`
    background-color: red;
    display: block;
  `]
})
export class HomeComponent implements OnInit {
  public message: string;

  ngOnInit() {
    this.message = 'Hello';
  }
}

@Component({
  selector: 'app-test',
  template: `<h3>{{ message }}</h3>`
})
export class TestComponent implements OnInit {
  public message: string;

  constructor() {}

  ngOnInit() {
    this.message = 'asdfasdfasd TEST';
  }
}


@Component({
  selector: 'app-not-found',
  template: `<h3>{{ message }}</h3>`
})
export class NotFoundComponent implements OnInit {
  public message: string;

  constructor() {}

  ngOnInit() {
    this.message = 'NOT FOUND';
  }
}
