import { Key, LocalStorage } from "../storage/LocalStorage"

const mockLocalStorage: LocalStorage = new (class implements LocalStorage {
  _localStore = {}

  addOnChangedListener(
    callback: (changes: object, areaName: string) => void
  ): void {}

  get<T>(key: Key<T>): Promise<{ [p: string]: T }> {
    return key.key in this._localStore
      ? (this._localStore as any)[key.key]
      : null
  }

  set<T>(key: Key<T>, value: any): void {
    (this._localStore as any)[key.key] = value
  }
})()

export { mockLocalStorage }
