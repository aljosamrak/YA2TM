import { TestBed } from '@angular/core/testing'
import { skip, Subscription } from 'rxjs'
import { LocalStorageStub } from '../../../test/LocalStorageStub'

import { LocalStorageService } from '../../storage/service/local-storage.service'
import { UserPreferences } from '../model/user-preferences'
import { SettingsService } from './settings.service'

describe('SettingsService', () => {
  let service: SettingsService
  let subscription: Subscription
  let userPreferencesCallbackCalledTimes: number
  let localStorageStub: LocalStorageStub

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SettingsService, { provide: LocalStorageService, useClass: LocalStorageStub }],
    })
    service = TestBed.inject(SettingsService)
    localStorageStub = TestBed.inject(LocalStorageService) as unknown as LocalStorageStub

    // Define callback to assert if it was called
    userPreferencesCallbackCalledTimes = 0
    subscription = service.userPreferences$.pipe(skip(1)).subscribe((item: UserPreferences) => {
      userPreferencesCallbackCalledTimes++
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
    expect(userPreferencesCallbackCalledTimes).toBe(1)
    expect(localStorageStub.setCallCount).toBe(1)
  })

  it('should be able to enable experiments', () => {
    expect(service.getUserPreferences().experimentsEnabled).toBeFalse()

    service.enableExperiments()

    expect(service.getUserPreferences().experimentsEnabled).toBeTrue()
    expect(userPreferencesCallbackCalledTimes).toBe(1)
    expect(localStorageStub.setCallCount).toBe(1)
  })

  it('updating preferences observable called once', () => {
    service.updateUserPreferences(new UserPreferences())

    expect(userPreferencesCallbackCalledTimes).toEqual(1)
  })
})
