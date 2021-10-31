import { Record } from '../types'

function connect_database() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const openRequest = indexedDB.open('TabsDB', 1)
    openRequest.onerror = (event) => {
      console.log('Problem opening DB.')
    }
    openRequest.onupgradeneeded = (event: any) => {
      console.log(event)
      const db = event!.target!.result

      if (!db.objectStoreNames.contains('tabs')) {
        const objectStore = db.createObjectStore('tabs', { keyPath: 'timestamp' })

        /*
              console.log(`upgrading database from ${ oldVersion } to ${ newVersion }`)
          switch (oldVersion) {
            case 0: {
              const
                navigation = db.createObjectStore('navigation', { keyPath: 'date' }),
                resource = db.createObjectStore('resource', { keyPath: 'id', autoIncrement: true })
              resource.createIndex('dateIdx', 'date', { unique: false })
              resource.createIndex('nameIdx', 'name', { unique: false })
            }
          }
          */

        objectStore.transaction.oncomplete = (event: any) => {
          console.log('ObjectStore Created.')
        }
      }
    }
    openRequest.onsuccess = (event: any) => {
      const db = event.target.result
      console.log('DB OPENED.')
      // db.onerror = function (event) {
      //   console.log('FAILED TO OPEN DB.')
      // }

      resolve(db)
    }
  })
}

export function insert_records(record: Record): Promise<boolean> {
  return connect_database().then((db: IDBDatabase): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      console.log('Inserting a record:', record)
      const transaction = db.transaction('tabs',
        'readwrite')
      const objectStore = transaction.objectStore('tabs')
      transaction.oncomplete = () => {
        console.log('ALL INSERT TRANSACTIONS COMPLETE.')
        resolve(true)
      }
      transaction.onerror = (e: Event) => {
        console.log('PROBLEM INSERTING RECORDS.')
        console.log(e)
        resolve(false)
      }
      const request = objectStore.add(record)
      request.onsuccess = () => {
        console.log('Added: ', record)
      }
    })
  })/*.catch(error)*/
}

export async function query(startDate: number, endDate: number): Promise<Record[]> {
  const db = await connect_database()
  return await new Promise<Record[]>((resolve, reject) => {
    console.log(`Query startDate: ${startDate}, endDate: ${endDate}`)
    const keyRangeValue = IDBKeyRange.lowerBound(startDate, true)

    const transaction = db.transaction('tabs', 'readonly')
    const objectStore = transaction.objectStore('tabs')
    const request = objectStore.openCursor(keyRangeValue)

    const myArray: Record[] = []
    request.onsuccess = function() {
      const cursor = this.result
      if (!cursor) {
        return
      }
      myArray.push(cursor.value)
      cursor.continue()
    }
    transaction.oncomplete = () => {
      // onCompleteCallbackFunction(myArray)
      console.log(myArray)
      resolve(myArray)
    }
    transaction.onerror = () => {
      // onCompleteCallbackFunction(myArray)
      console.log('ERROR')
      resolve([])
    }
  })
}
