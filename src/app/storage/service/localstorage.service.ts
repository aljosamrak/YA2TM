import { Injectable } from '@angular/core'
import { Key } from '../model/Key'

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  constructor() {}

  async get<T>(key: Key<T>): Promise<T> {
    try {
      // TODO chrome.storage.sync
      const result = await chrome.storage.local.get({
        [key.key]: key.defaultValue,
      })

      if (result[key.key]) {
        return result[key.key]
      }
    } catch (e) {
      console.log(e)
      throw e
    }

    if (chrome.runtime.lastError) {
      throw new Error('Encountered error: ' + chrome.runtime.lastError)
    }

    return key.defaultValue()
  }

  async set(key: Key<any>, value: any): Promise<void> {
    return chrome.storage.local.set({ [key.key]: value })
  }

  addOnChangedListener(
    callback: (changes: object, areaName: string) => void,
  ): void {
    chrome.storage.onChanged.addListener(callback)
  }
}
