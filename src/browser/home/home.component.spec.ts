import { TestBed } from '@angular/core/testing'
import { HomeComponent } from './home.component'
import { HomeTestingModule } from './home.module.testing'

describe(HomeComponent.name, () => {
  it('should compile', () => {
    TestBed.configureTestingModule({
      imports: [HomeTestingModule]
    })

    expect(TestBed.createComponent(HomeComponent)).toBeTruthy()
  })
})