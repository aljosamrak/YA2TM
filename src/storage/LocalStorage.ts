type Key<T> = {
  key: string;
  defaultValue: T;
}

interface LocalStorage {
  get<T>(key: Key<T>): Promise<{ [key: string]: T }>

  set(key: Key<any>, value: any): void
}

export { LocalStorage, Key }
