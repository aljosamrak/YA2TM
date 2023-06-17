import { TestBed } from '@angular/core/testing'
import { BrowserTestingModule } from '@angular/platform-browser/testing'
import { LoggerTestingModule } from 'ngx-logger/testing'
import 'zone.js'
import 'zone.js/testing'
import { UserPreferences } from '../../settings/model/user-preferences'
import { USER_PREFERENCES } from '../model/Key'

import { LocalStorageService } from './local-storage.service'
;(window as any).global = window

const map = new Map<string, string>()
const chrome = {
  storage: {
    local: {
      clear: () => map.clear(),
      set: (items: any) => {
        for (const key of Object.keys(items)) {
          map.set(key, items[key])
        }
        return Promise.resolve()
      },
      get: (key: any) => Promise.resolve({ [key]: map.get(key) }),
    },
  },
}

const STRING_KEY = {
  key: 'key',
  defaultValue: () => 'value',
  isStringType: true,
}

describe('LocalstorageService', () => {
  let service: LocalStorageService

  beforeEach(() => {
    // @ts-ignore
    global.chrome = chrome

    TestBed.configureTestingModule({
      imports: [BrowserTestingModule, LoggerTestingModule],
    })
    service = TestBed.inject(LocalStorageService)
  })

  afterEach(() => {
    chrome.storage.local.clear()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should return same value as saved', async () => {
    const value = 'value'
    await service.set(STRING_KEY, value)

    const result = await service.get(STRING_KEY)

    expect(result).toEqual(value)
  })

  it('no saved value should return default value', async () => {
    const value = 'value'

    const result = await service.get(STRING_KEY)

    expect(result).toEqual(value)
  })

  it('JSON is parsed to object', async () => {
    const preferences = new UserPreferences()
    preferences.deduplicateDontDeduplicateUrls = 'some-value'
    await chrome.storage.local.set({
      [USER_PREFERENCES.key]: JSON.stringify(preferences),
    })

    const result = await service.get(USER_PREFERENCES)

    expect(result).toEqual(preferences)
  })

  it('object in storage is returned as object', async () => {
    const preferences = new UserPreferences()
    preferences.deduplicateDontDeduplicateUrls = 'some-value'
    await chrome.storage.local.set({ [USER_PREFERENCES.key]: preferences })

    const result = await service.get(USER_PREFERENCES)

    expect(result).toEqual(preferences)
  })

  it('object is saved as JSON', async () => {
    await service.set(USER_PREFERENCES, new UserPreferences())

    const result: { [key: string]: any } = await chrome.storage.local.get(
      USER_PREFERENCES.key,
    )

    expect(result[USER_PREFERENCES.key]).toEqual(
      JSON.stringify(new UserPreferences()),
    )
  })

  it('on failed read returns default value', async () => {
    // Insert value that will faIll JSON parsing
    await chrome.storage.local.set({ [USER_PREFERENCES.key]: 'invalid value' })

    const result = await service.get(USER_PREFERENCES)

    expect(result).toEqual(USER_PREFERENCES.defaultValue())
  })
})
