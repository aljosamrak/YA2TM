import { Injectable } from '@angular/core'
import { Key, LocalStorage } from './LocalStorage'

@Injectable({
  providedIn: 'root',
}) // TODO change to chrome.sync
class LocalStorageImpl implements LocalStorage {
  async get<T>(key: Key<T>): Promise<{ [key: string]: T }> {
    return chrome.storage.local.get(key.key).then((result) => {
      if (result[key.key]) {
        return result
      }
      return { [key.key]: key.defaultValue }
    })
  }

  async get1<T>(key: string): Promise<any> {
    return chrome.storage.local.get(key).then((result) => {
      return result[key] as T
    })
  }

  async set(key: Key<any>, value: any): Promise<void> {
    return chrome.storage.local.set({ [key.key]: value })
  }

  set1(key: string, value: any): void {
    chrome.storage.local.set({ [key]: value })
  }

  addOnChangedListener(
    callback: (changes: object, areaName: string) => void,
  ): void {
    chrome.storage.onChanged.addListener(callback)
  }
}

export { LocalStorageImpl }
