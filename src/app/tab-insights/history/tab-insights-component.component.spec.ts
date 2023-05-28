import { ComponentFixture, TestBed } from '@angular/core/testing'
import { LoggerTestingModule } from 'ngx-logger/testing'

import { DatabaseService } from '../../storage/service/database.service'
import { TabInsightsComponent } from './tab-insights-component.component'

describe('tab-insights', () => {
  let component: TabInsightsComponent
  let fixture: ComponentFixture<TabInsightsComponent>

  const databaseSpy = jasmine.createSpyObj('DatabaseService', ['query'])

  beforeEach(async () => {
    databaseSpy.query.and.returnValue(Promise.resolve([]))

    await TestBed.configureTestingModule({
      declarations: [TabInsightsComponent],
      imports: [LoggerTestingModule],
      providers: [{ provide: DatabaseService, useValue: databaseSpy }],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TabInsightsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
