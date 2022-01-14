import { injectable } from "inversify"
import { Key, LocalStorage } from "./LocalStorage"

@injectable()
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

  removeItem(key: Key<any>): Promise<void> {
    return chrome.storage.local.remove(key.key)
  }
}

export { LocalStorageImpl }
