import { Record } from '../types';

function connect_database() {
    return new Promise<IDBDatabase>(function (resolve, reject) {
        const openRequest = indexedDB.open('TabsDB', 1);
        openRequest.onerror = function (event) {
            console.log("Problem opening DB.");
        }
        openRequest.onupgradeneeded = function (event: any) {
            console.log(event);
            var db = event!.target!.result;


            if (!db.objectStoreNames.contains('tabs')) {
                let objectStore = db.createObjectStore('tabs', { keyPath: 'timestamp' });


                /*
                      console.log(`upgrading database from ${ oldVersion } to ${ newVersion }`);
                  switch (oldVersion) {
                    case 0: {
                      const
                        navigation = db.createObjectStore('navigation', { keyPath: 'date' }),
                        resource = db.createObjectStore('resource', { keyPath: 'id', autoIncrement: true });
                      resource.createIndex('dateIdx', 'date', { unique: false });
                      resource.createIndex('nameIdx', 'name', { unique: false });
                    }
                  }
                  */



                objectStore.transaction.oncomplete = function (event: any) {
                    console.log("ObjectStore Created.");
                }
            }
        }
        openRequest.onsuccess = function (event: any) {
            var db = event.target.result;
            console.log("DB OPENED.");
            // db.onerror = function (event) {
            //   console.log("FAILED TO OPEN DB.")
            // }

            resolve(db);
        };
    });
}




export function insert_records(record: Record): Promise<boolean> {
    return connect_database().then(function (db: IDBDatabase): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            console.log("Inserting a record:", record)
            const insert_transaction = db.transaction("tabs",
                "readwrite");
            const objectStore = insert_transaction.objectStore("tabs");
            insert_transaction.oncomplete = function () {
                console.log("ALL INSERT TRANSACTIONS COMPLETE.");
                resolve(true);
            }
            insert_transaction.onerror = function (e: Event) {
                console.log("PROBLEM INSERTING RECORDS.")
                console.log(e)
                resolve(false);
            }
            let request = objectStore.add(record);
            request.onsuccess = function () {
                console.log("Added: ", record);
            }
        });
    })/*.catch(error)*/;
}




export async function query(startDate: number, endDate: number): Promise<Array<Record>> {
    const db = await connect_database();
    return await new Promise<Array<Record>>((resolve, reject) => {
        console.log(`Query startDate: ${startDate}, endDate: ${endDate}`);
        var keyRangeValue = IDBKeyRange.lowerBound(startDate, true);

        const transaction = db.transaction("tabs", 'readonly');
        const objectStore = transaction.objectStore('tabs');
        var request = objectStore.openCursor(keyRangeValue);

        var myArray: Array<Record> = [];
        request.onsuccess = function () {
            var cursor = this.result;
            if (!cursor)
                return;
            myArray.push(cursor.value);
            cursor.continue();
        };
        transaction.oncomplete = function () {
            // onCompleteCallbackFunction(myArray);
            console.log(myArray);
            resolve(myArray);
        };
        transaction.onerror = function () {
            // onCompleteCallbackFunction(myArray);
            console.log("ERROR");
            resolve([]);
        };
    });
}