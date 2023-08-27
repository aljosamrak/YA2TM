import { Key } from '../app/storage/model/Key'
import { Change } from '../app/storage/service/local-storage.service'

export class LocalStorageStub {
  private map = new Map<string, any>()
  setCallCount = 0
  private listeners: Array<(newValue: any) => void> = []

  async get<T extends {} | string | undefined>(key: Key<T>): Promise<T> {
    return new Promise(() => this.map.get(key.key))
  }

  async set<T>(key: Key<T>, value: T): Promise<void> {
    this.setCallCount++

    this.map.set(key.key, value)

    this.listeners.forEach((listener) => listener(value))

    return new Promise(() => {})
  }

  addOnNewValueListener<T extends {}>(key: Key<T>, callback: (newValue: T) => void): (changes: Change) => void {
    this.listeners.push(callback)

    return (changes: Change) => {
      callback(key.defaultValue())
    }
  }

  removeOnChangeListener(callback: (changes: Change, areaName: string) => void) {
    // Do nothing
  }
}
