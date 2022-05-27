import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { LoggerTestingModule } from 'ngx-logger/testing'

import { AnalyticsService } from '../../analytics/analytics.service'
import { SettingsComponent } from './settings.component'

describe('SettingsComponent', () => {
  let component: SettingsComponent
  let fixture: ComponentFixture<SettingsComponent>

  const analyticsSpy = jasmine.createSpyObj('AnalyticsService', ['event'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggerTestingModule, ReactiveFormsModule],
      providers: [
        SettingsComponent,
        { provide: AnalyticsService, useValue: analyticsSpy },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
