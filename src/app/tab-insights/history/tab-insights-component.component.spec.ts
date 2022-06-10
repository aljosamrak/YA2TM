import { ComponentFixture, TestBed } from '@angular/core/testing'
import { LoggerTestingModule } from 'ngx-logger/testing'

import { AnalyticsService } from '../../analytics/analytics.service'
import { DatabaseService } from '../../storage/service/database.service'
import { TabInsightsComponent } from './tab-insights-component.component'

describe('tab-insights', () => {
  let component: TabInsightsComponent
  let fixture: ComponentFixture<TabInsightsComponent>

  const analyticSpy = jasmine.createSpyObj('AnalyticsService', ['event'])
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggerTestingModule],

      providers: [
        TabInsightsComponent,
        { provide: AnalyticsService, useValue: analyticSpy },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TabInsightsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  afterEach(async () => {
    await TestBed.inject(DatabaseService).close()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
