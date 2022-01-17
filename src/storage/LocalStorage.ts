type Key<T> = {
  key: string;
  defaultValue: T;
}

interface LocalStorage {
  get<T>(key: Key<T>): Promise<{ [key: string]: T }>

  set(key: Key<any>, value: any): void

  addOnChangedListener(callback: (changes: object, areaName: string) => void): void
}

export { LocalStorage, Key }
