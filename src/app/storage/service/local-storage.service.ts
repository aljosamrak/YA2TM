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

      return this.convertValue(value, key)
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

  /**
   * Adds the callback for a new value for the provided key
   *
   * @param key for which the call back will be called
   * @param callback that will be called on value change
   *
   * @returns callback that can be used for unsubscribe
   */
  addOnNewValueListener<T>(key: Key<T>, callback: (newValue: T) => void) {
    const createdCallback = (changes: Change) => {
      if (changes.hasOwnProperty(key.key)) {
        callback(this.convertValue(changes[key.key].newValue, key))
      }
    }

    chrome.storage.onChanged.addListener(createdCallback)

    return createdCallback
  }

  removeOnChangeListener(callback: (changes: Change, areaName: string) => void) {
    chrome.storage.onChanged.removeListener(callback)
  }

  private convertValue<T>(value: any, key: Key<T>) {
    if (typeof value !== 'string') {
      return value
    }

    if (key.isStringType) {
      // @ts-ignore
      return value
    }

    return LocalStorageService.fromJsonString(value, key.defaultValue())
  }
}

type Change = { [p: string]: chrome.storage.StorageChange }
