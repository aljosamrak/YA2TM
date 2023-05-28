import { ComponentFixture, TestBed } from '@angular/core/testing'
import { LoggerTestingModule } from 'ngx-logger/testing'

import { DatabaseService } from '../storage/service/database.service'
import { DrillDownComponent } from './drill-down.component'

describe('DrillDownComponent', () => {
  let component: DrillDownComponent
  let fixture: ComponentFixture<DrillDownComponent>

  const databaseSpy = jasmine.createSpyObj('DatabaseService', ['getOpenTabs'])

  beforeEach(async () => {
    databaseSpy.getOpenTabs.and.returnValue(Promise.resolve([]))

    await TestBed.configureTestingModule({
      declarations: [DrillDownComponent],
      imports: [LoggerTestingModule],
      providers: [{ provide: DatabaseService, useValue: databaseSpy }],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DrillDownComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
