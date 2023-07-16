import { ComponentFixture, TestBed } from '@angular/core/testing'
import { LoggerTestingModule } from 'ngx-logger/testing'

import { DatabaseService } from '../../storage/service/database.service'
import { SnoozedTabsComponent } from './snooze-tabs.component'

describe('SnoozeComponent', () => {
  let component: SnoozedTabsComponent
  let fixture: ComponentFixture<SnoozedTabsComponent>

  const databaseSpy = jasmine.createSpyObj('DatabaseService', ['getSnoozedTabs'])

  beforeEach(async () => {
    databaseSpy.getSnoozedTabs.and.returnValue(Promise.resolve([]))

    await TestBed.configureTestingModule({
      declarations: [SnoozedTabsComponent],
      imports: [LoggerTestingModule],
      providers: [{ provide: DatabaseService, useValue: databaseSpy }],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SnoozedTabsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
