import { TestBed } from '@angular/core/testing'
import { AppSettingsComponent } from './settings.component'
import { SettingsModule } from './settings.module'

describe(AppSettingsComponent.name, () => {
  it('should compile', () => {
    TestBed.configureTestingModule({
      imports: [SettingsModule]
    })

    expect(TestBed.createComponent(AppSettingsComponent)).toBeTruthy()
  })
})