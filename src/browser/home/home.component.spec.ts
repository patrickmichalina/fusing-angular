import { TestBed } from '@angular/core/testing'
import { HomeComponent } from './home.component'
import { HomeModule } from './home.module'

describe(HomeComponent.name, () => {
  it('should compile', () => {
    TestBed.configureTestingModule({
      imports: [HomeModule]
    })

    expect(TestBed.createComponent(HomeComponent)).toBeTruthy()
  })
})