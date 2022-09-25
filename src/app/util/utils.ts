export default function groupBy<T, K extends keyof any>(
  list: T[],
  getKey: (item: T) => K,
) {
  return list.reduce((previous, currentItem) => {
    const group = getKey(currentItem)
    if (!previous.get(group)) {
      previous.set(group, [])
    }
    previous.get(group)?.push(currentItem)
    return previous
  }, new Map<K, T[]>())
}
