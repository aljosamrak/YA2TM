import { TestBed } from '@angular/core/testing'
import { LoggerTestingModule } from 'ngx-logger/testing'

import { SettingsServiceStub } from '../../../test/SettingsServiceStub'
import { SettingsService } from '../../settings/service/settings.service'
import { DatabaseService } from '../../storage/service/database.service'
import { LocalStorageService } from '../../storage/service/local-storage.service'
import { SnoozeService } from './snooze.service'

describe('SnoozeService', () => {
  let service: SnoozeService

  const databaseSpy = jasmine.createSpyObj('DatabaseService', [''])
  const localStorageSpy = jasmine.createSpyObj('LocalStorageService', [
    'get',
    'addOnChangedListener',
  ])

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule],
      providers: [
        { provide: DatabaseService, useValue: databaseSpy },
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: SettingsService, useClass: SettingsServiceStub },
      ],
    })
    service = TestBed.inject(SnoozeService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
