import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { LoggerTestingModule } from 'ngx-logger/testing'

import { SettingsServiceStub } from '../../../test/SettingsServiceStub'
import { AnalyticsService } from '../../analytics/analytics.service'
import { DatabaseService } from '../../storage/service/database.service'
import { SettingsService } from '../service/settings.service'
import { SettingsComponent } from './settings.component'

describe('SettingsComponent', () => {
  let component: SettingsComponent
  let fixture: ComponentFixture<SettingsComponent>

  const analyticsSpy = jasmine.createSpyObj('AnalyticsService', ['event'])
  const databaseSpy = jasmine.createSpyObj('DatabaseService', [''])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggerTestingModule, ReactiveFormsModule],
      providers: [
        SettingsComponent,
        { provide: AnalyticsService, useValue: analyticsSpy },
        { provide: DatabaseService, useValue: databaseSpy },
        { provide: SettingsService, useClass: SettingsServiceStub },
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
