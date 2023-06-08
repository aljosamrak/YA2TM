import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'

import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { By } from '@angular/platform-browser'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { LoggerTestingModule } from 'ngx-logger/testing'
import { SettingsServiceStub } from '../../../test/SettingsServiceStub'
import { AnalyticsService } from '../../analytics/analytics.service'
import { DatabaseService } from '../../storage/service/database.service'
import { SettingsService } from '../service/settings.service'
import { SettingsComponent } from './settings.component'
import arrayContaining = jasmine.arrayContaining

describe('SettingsComponent', () => {
  let component: SettingsComponent
  let fixture: ComponentFixture<SettingsComponent>

  const analyticsSpy = jasmine.createSpyObj('AnalyticsService', ['event'])
  const databaseSpy = jasmine.createSpyObj('DatabaseService', [''])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [LoggerTestingModule, MatInputModule, MatSelectModule, MatSlideToggleModule, NoopAnimationsModule, ReactiveFormsModule],
      providers: [
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

  describe('setting values', () => {
    it('toggle input is saved', () => {
      const preSetting = component.userPreferences
      const slider = fixture.debugElement.query(By.css('form mat-slide-toggle')).componentInstance

      slider.toggle()

      expect(component.userPreferences).not.toBe(preSetting)
    })

    // it('textarea input is saved', () => {
    //   component.userPreferences.experimentsEnabled = true
    //   fixture.detectChanges()
    //   const textarea = fixture.debugElement.query(By.css('form textarea')).nativeElement
    //
    //   expect(textarea.value).toBe(component.userPreferences.deduplicateDontDeduplicateUrls)
    //
    //   textarea.value = 'someValue'
    //   textarea.dispatchEvent(new Event('input')) // fire an input even ti be picked up b form
    //   fixture.detectChanges()
    //
    //   expect(component.userPreferences.deduplicateDontDeduplicateUrls).toBe('someValue')
    // })
  })

  describe('experiment', () => {
    const experimentalSettings = ['Deduplicate tabs', 'Snoozed tabs', 'Experiments', 'About', 'Version']
    it('experiment disabled by default', () => {
      expect(
        Array.from(fixture.nativeElement.querySelectorAll('mat-panel-title').values()).map((it: any) => it.textContent.trim()),
      ).not.toEqual(arrayContaining(experimentalSettings))
    })

    it('experiments shown after enabled', () => {
      component.userPreferences.experimentsEnabled = true
      fixture.detectChanges()

      expect(
        Array.from(fixture.nativeElement.querySelectorAll('mat-panel-title').values()).map((it: any) => it.textContent.trim()),
      ).toEqual(arrayContaining(experimentalSettings))
    })
  })
})
