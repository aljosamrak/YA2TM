import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SettingsServiceStub } from '../../test/SettingsServiceStub'
import { AnalyticsService } from '../analytics/analytics.service'
import { SettingsService } from '../settings/service/settings.service'
import { PopupComponent } from './popup.component'

describe('PopupComponent', () => {
  const analyticsSpy = jasmine.createSpyObj('AnalyticsService', [
    'event',
    'time',
    'resetUuid',
  ])

  let component: PopupComponent
  let fixture: ComponentFixture<PopupComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        PopupComponent,
        { provide: AnalyticsService, useValue: analyticsSpy },
        { provide: SettingsService, useClass: SettingsServiceStub },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
