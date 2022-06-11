import 'zone.js'
import 'zone.js/testing'

import { TestBed } from '@angular/core/testing'
import { BrowserTestingModule } from '@angular/platform-browser/testing'

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
describe('LocalstorageService', () => {
  let service: LocalStorageService

  beforeEach(() => {
    // @ts-ignore
    global.chrome = chrome

    TestBed.configureTestingModule({ imports: [BrowserTestingModule] })
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
    await service.set({ key: 'key', defaultValue: () => '' }, value)
    const result = await service.get({ key: 'key', defaultValue: () => '' })

    expect(result).toBe(value)
  })

  it('no saved value should return default value', async () => {
    const value = 'value'
    const result = await service.get({ key: 'key', defaultValue: () => value })

    expect(result).toBe(value)
  })
})
