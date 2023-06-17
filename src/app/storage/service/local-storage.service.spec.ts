import { TestBed } from '@angular/core/testing'
import { BrowserTestingModule } from '@angular/platform-browser/testing'
import { LoggerTestingModule } from 'ngx-logger/testing'
import 'zone.js'
import 'zone.js/testing'
import { UserPreferences } from '../../settings/model/user-preferences'
import { USER_PREFERENCES } from '../model/Key'

import { LocalStorageService } from './local-storage.service'
;(window as any).global = window

const storageMap = new Map<string, string>()
const chrome = {
  storage: {
    local: {
      clear: () => storageMap.clear(),
      set: (items: any) => {
        for (const key of Object.keys(items)) {
          storageMap.set(key, items[key])
        }
        return Promise.resolve()
      },
      get: (key: any) => Promise.resolve({ [key]: storageMap.get(key) }),
    },
    onChanged: {
      addListener: (callback: (changes: { [p: string]: chrome.storage.StorageChange }, areaName: string) => void) => {},
    },
  },
}

const STRING_KEY = {
  key: 'key',
  defaultValue: () => 'value',
  isStringType: true,
}

const OBJECT_KEY = {
  key: 'key',
  defaultValue: () => {
    return { value: 'value' }
  },
  isStringType: false,
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

  it('no saved value should return default value', async () => {
    const value = 'value'

    const result = await service.get(STRING_KEY)

    expect(result).toEqual(value)
  })

  describe('get', () => {
    it('should return same value as saved', async () => {
      const value = 'value'
      await service.set(STRING_KEY, value)

      const result = await service.get(STRING_KEY)

      expect(result).toEqual(value)
    })

    it('on failed read returns default value', async () => {
      // Insert value that will faIll JSON parsing
      await chrome.storage.local.set({ [USER_PREFERENCES.key]: 'invalid value' })

      const result = await service.get(USER_PREFERENCES)

      expect(result).toEqual(USER_PREFERENCES.defaultValue())
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
  })

  describe('set', () => {
    it('object is saved as JSON', async () => {
      await service.set(USER_PREFERENCES, new UserPreferences())

      const result: { [key: string]: any } = await chrome.storage.local.get(USER_PREFERENCES.key)

      expect(result[USER_PREFERENCES.key]).toEqual(JSON.stringify(new UserPreferences()))
    })
  })

  describe('addOnNewValueListener', () => {
    it('should work for string', async () => {
      let called = false
      let value = ''
      const callback = await service.addOnNewValueListener(STRING_KEY, (change) => {
        called = true
        value = change
      })

      callback({ [STRING_KEY.key]: { newValue: 'value' } })

      expect(called).toBeTrue()
      expect(value).toEqual('value')
    })

    it('should work for object as JSON', async () => {
      let called = false
      let value = {}
      const callback = await service.addOnNewValueListener(OBJECT_KEY, (change) => {
        called = true
        value = change
      })

      callback({ [OBJECT_KEY.key]: { newValue: JSON.stringify({ value: 'value' }) } })

      expect(called).toBeTrue()
      expect(value).toEqual({ value: 'value' })
    })

    it('should work for object', async () => {
      let called = false
      let value = {}
      const callback = await service.addOnNewValueListener(OBJECT_KEY, (change) => {
        called = true
        value = change
      })

      callback({ [OBJECT_KEY.key]: { newValue: { value: 'value' } } })

      expect(called).toBeTrue()
      expect(value).toEqual({ value: 'value' })
    })
  })
})
