import { injectable } from "inversify"

@injectable()
class LocalStorageImpl implements LocalStorage {
  private readonly storage: LocalStorage

  public constructor(getStorage = (): LocalStorage => window.localStorage) {
    this.storage = getStorage()
  }

  getItem(key: string): string | null {
    return this.storage.getItem(key)
  }

  removeItem(key: string): void {
    this.storage.removeItem(key)
  }

  setItem(key: string, value: string): void {
    this.storage.setItem(key, value)
  }
}

export { LocalStorageImpl }
