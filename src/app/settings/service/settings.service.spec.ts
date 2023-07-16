import { TestBed } from '@angular/core/testing'
import { skip, Subscription } from 'rxjs'

import { LocalStorageService } from '../../storage/service/local-storage.service'
import { UserPreferences } from '../model/user-preferences'
import { SettingsService } from './settings.service'

describe('SettingsService', () => {
  let service: SettingsService
  let subscription: Subscription
  let userPreferencesCallbackCalled: boolean

  const localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['get', 'set', 'addOnNewValueListener'])
  beforeEach(() => {
    localStorageSpy.get.and.returnValue(Promise.resolve(new UserPreferences()))
    TestBed.configureTestingModule({
      providers: [SettingsService, { provide: LocalStorageService, useValue: localStorageSpy }],
    })
    service = TestBed.inject(SettingsService)

    // Define callback to assert if it was called
    userPreferencesCallbackCalled = false
    subscription = service.userPreferences$.pipe(skip(1)).subscribe((item: UserPreferences) => {
      userPreferencesCallbackCalled = true
    })
  })

  afterEach(() => {
    subscription.unsubscribe()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('getUserPreferences returns proper object with equals method', () => {
    expect(UserPreferences.equals(service.getUserPreferences(), new UserPreferences())).toBeTrue()
  })

  it('should be able to update preferences', () => {
    const preferences = new UserPreferences()
    preferences.deduplicateStripUrlParts = 'new value'

    service.updateUserPreferences(preferences)

    expect(service.getUserPreferences().deduplicateStripUrlParts).toEqual('new value')
    expect(userPreferencesCallbackCalled).toBeTrue()
    expect(localStorageSpy.set).toHaveBeenCalled()
  })

  it('should be able to enable experiments', () => {
    expect(service.getUserPreferences().experimentsEnabled).toBeFalse()

    service.enableExperiments()

    expect(service.getUserPreferences().experimentsEnabled).toBeTrue()
    expect(userPreferencesCallbackCalled).toBeTrue()
    expect(localStorageSpy.set).toHaveBeenCalled()
  })
})
