import { TestBed } from '@angular/core/testing'
import { AppHomeComponent } from './home.component'
import { HomeModule } from './home.module'

describe(AppHomeComponent.name, () => {
  it('should compile', () => {
    TestBed.configureTestingModule({
      imports: [HomeModule]
    })

    expect(TestBed.createComponent(AppHomeComponent)).toBeTruthy()
  })
})