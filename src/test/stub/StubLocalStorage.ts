import { Key, LocalStorage } from '../../storage/LocalStorage'

class StubLocalStorage implements LocalStorage {
  _localStore = {}

  addOnChangedListener(
    callback: (changes: object, areaName: string) => void,
  ): void {}

  get<T>(key: Key<T>): Promise<{ [p: string]: T }> {
    if (key.key in this._localStore) {
      return Promise.resolve({ [key.key]: (this._localStore as any)[key.key] })
    }
    return Promise.resolve({ [key.key]: key.defaultValue })
  }

  set<T>(key: Key<T>, value: any): void {
    ;(this._localStore as any)[key.key] = value
  }
}

export { StubLocalStorage }
