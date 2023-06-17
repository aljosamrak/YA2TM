import { TestBed } from '@angular/core/testing'

import { LocalStorageService } from '../../storage/service/local-storage.service'
import { UserPreferences } from '../model/user-preferences'
import { SettingsService } from './settings.service'

describe('SettingsService', () => {
  let service: SettingsService

  const localStorageSpy = jasmine.createSpyObj('LocalStorageService', [
    'get',
    'addOnChangedListener',
  ])

  beforeEach(() => {
    localStorageSpy.get.and.returnValue(Promise.resolve(new UserPreferences()))

    TestBed.configureTestingModule({
      providers: [
        SettingsService,
        { provide: LocalStorageService, useValue: localStorageSpy },
      ],
    })
    service = TestBed.inject(SettingsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('getUserPreferences returns proper object with equals method', () => {
    expect(
      UserPreferences.equals(
        service.getUserPreferences(),
        new UserPreferences(),
      ),
    ).toBeTrue()
  })
})
