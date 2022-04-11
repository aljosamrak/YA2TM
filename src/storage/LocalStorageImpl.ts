import {Key, LocalStorage} from './LocalStorage'
import {Injectable} from '@angular/core'

@Injectable({
  providedIn: 'root',
}) // TODO change to chrome.sync
class LocalStorageImpl implements LocalStorage {
  async get<T>(key: Key<T>): Promise<{ [key: string]: T }> {
    return chrome.storage.local.get(key.key).then((result) => {
      if (result[key.key]) {
        return result
      }
      return { key: key.defaultValue }
    })
  }

  async set(key: Key<any>, value: any): Promise<void> {
    return chrome.storage.local.set({ [key.key] : value })
  }

  addOnChangedListener(callback: (changes: object, areaName: string) => void): void {
    chrome.storage.onChanged.addListener(callback)
  }
}

export { LocalStorageImpl }
