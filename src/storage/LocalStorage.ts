type Key<T> = {
  key: string
  defaultValue: T
}

interface LocalStorage {
  get<T>(key: Key<T>): Promise<{ [key: string]: T }>

  get1<T>(key: string): Promise<any>

  set(key: Key<any>, value: any): void

  set1(key: string, value: any): void

  addOnChangedListener(
    callback: (changes: object, areaName: string) => void,
  ): void
}

export { LocalStorage, Key }
