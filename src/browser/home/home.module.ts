import { NgModule } from '@angular/core'
import { HomeComponent } from './home.component'
import { HomeRoutingModule } from './home-routing.module'
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [HomeRoutingModule, CommonModule],
  exports: [HomeComponent],
  declarations: [HomeComponent]
})
export class HomeModule { }
