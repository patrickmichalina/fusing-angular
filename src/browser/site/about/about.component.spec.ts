import { TestBed } from '@angular/core/testing'
import { AboutComponent } from './about.component'
import { AboutModule } from './about.module'

describe(AboutComponent.name, () => {
  it('should compile', () => {
    TestBed.configureTestingModule({
      imports: [AboutModule]
    })

    expect(TestBed.createComponent(AboutComponent)).toBeTruthy()
  })
})