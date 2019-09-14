import { TestBed } from '@angular/core/testing'
import { NotFoundComponent } from './not-found.component'
import { NotFoundModule } from './not-found.module'

describe(NotFoundComponent.name, () => {
  it('should compile', () => {
    TestBed.configureTestingModule({
      imports: [NotFoundModule]
    })

    expect(TestBed.createComponent(NotFoundComponent)).toBeTruthy()
  })
})