import { Injectable } from '@angular/core'
import { NGXLogger } from 'ngx-logger'

import { Key } from '../model/Key'

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(private logger: NGXLogger) {}

  private static fromJsonString<T>(jsonString: string, newObject: T) {
    return <T>JSON.parse(jsonString, function (key, value) {
      if (typeof value === 'object') {
        return Object.assign(newObject, value)
      }
      return value
    })
  }

  async get<T>(key: Key<T>): Promise<T> {
    try {
      // TODO chrome.storage.sync
      const result = await chrome.storage.local.get(key.key)

      if (!result[key.key]) {
        return key.defaultValue()
      }

      const value = result[key.key]

      if (typeof value !== 'string') {
        return value
      }

      if (key.isStringType) {
        // @ts-ignore
        return value
      }

      return LocalStorageService.fromJsonString(value, key.defaultValue())
    } catch (e) {
      this.logger.log(e)
      return key.defaultValue()
    }
  }

  async set<T>(key: Key<T>, value: T): Promise<void> {
    let stringValue
    if (typeof value === 'string') {
      stringValue = value
    } else {
      stringValue = JSON.stringify(value)
    }
    return chrome.storage.local.set({ [key.key]: stringValue })
  }

  addOnChangedListener(callback: (changes: object, areaName: string) => void) {
    chrome.storage.onChanged.addListener(callback)
  }

  removeOnChangeListener(
    callback: (changes: object, areaName: string) => void,
  ) {
    chrome.storage.onChanged.removeListener(callback)
  }
}
