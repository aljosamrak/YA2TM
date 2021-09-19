// chrome.runtime.onInstalled.addListener(details => {
//   // if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
//   //   chrome.runtime.setUninstallURL('https://example.com/extension-survey');
//   // }

//   // chrome.windows.getCurrent({ 'populate': true }, function (window) {
//   // chrome.action.setBadgeText(chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_NONE}).size());
//   // });


// });


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message:", request)

  if (request.message === 'get') {
    const response = query(request.payload.startTime, request.payload.endTime);
    response.then(res => {
      // TODO delete after migration
      const parsed = JSON.parse(request.payload.localStorageData)
      console.log("Parsed value", parsed)
      console.log("Differneces:\n", equals(parsed, res));

      chrome.runtime.sendMessage({
        message: 'get_success',
        payload: res
      });
    });
  }
});



function connect_database() {
  return new Promise(function (resolve, reject) {
    const openRequest = indexedDB.open('TabsDB', 1);
    openRequest.onerror = function (event) {
      console.log("Problem opening DB.");
    }
    openRequest.onupgradeneeded = function (event) {
      console.log(event);
      var db = event.target.result;


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



        objectStore.transaction.oncomplete = function (event) {
          console.log("ObjectStore Created.");
        }
      }
    }
    openRequest.onsuccess = function (event) {
      var db = event.target.result;
      console.log("DB OPENED.");

      db.onerror = function (event) {
        console.log("FAILED TO OPEN DB.")
      }

      resolve(db);
    };
  });
}

function insert_records(record) {
  return connect_database().then(function (db) {
    return new Promise((resolve, reject) => {
      console.log("Inserting a record:", record)
      const insert_transaction = db.transaction("tabs",
        "readwrite");
      const objectStore = insert_transaction.objectStore("tabs");
      insert_transaction.oncomplete = function () {
        console.log("ALL INSERT TRANSACTIONS COMPLETE.");
        resolve(true);
      }
      insert_transaction.onerror = function () {
        console.log("PROBLEM INSERTING RECORDS.")
        resolve(false);
      }
      let request = objectStore.add(record);
      request.onsuccess = function () {
        console.log("Added: ", record);
      }
    });
  });
}

function update_record(record) {
  return connect_database().then(function (db) {
    return new Promise((resolve, reject) => {
      console.log("Updating a record:", record)
      const put_transaction = db.transaction("tabs", "readwrite");
      const objectStore = put_transaction.objectStore("tabs");
      put_transaction.oncomplete = function () {
        console.log("ALL PUT TRANSACTIONS COMPLETE.");
        resolve(true);
      }
      put_transaction.onerror = function () {
        console.log("PROBLEM UPDATING RECORDS.")
        resolve(false);
      }
      objectStore.put(record);
    });
  });
}

function query(startDate, endDate) {
  return connect_database().then(function (db) {
    return new Promise((resolve, reject) => {
      console.log(`Query startDate: ${startDate}, endDate: ${endDate}`);
      var keyRangeValue = IDBKeyRange.lowerBound(startDate, true)

      const transaction = db.transaction("tabs", 'readonly');
      const objectStore = transaction.objectStore('tabs');
      var request = objectStore.openCursor(keyRangeValue)

      var myArray = [];
      request.onsuccess = function () {
        var cursor = this.result;
        if (!cursor) return;
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
  });
}

chrome.tabs.onCreated.addListener(function (tab) {
  add(tab, 'opened');
});

chrome.tabs.onRemoved.addListener(function (tab) {
  add(tab, 'closed');
});

function add(tab, operation) {
  // Get all the items stored in the storage
  chrome.storage.local.get(function (items) {
    console.log('Get from storage');
    console.log(items);


    chrome.tabs.query({}, function (tabs) {
      console.log('Tabs count: ' + tabs.length);

      if (Object.keys(items).length > 0 && items.data) {
        // The data array already exists, add to it the new server and nickname
        items.data.push({ timestamp: Date.now(), status: operation, tabs: tabs.length });
      } else {
        // The data array doesn't exist yet, create it
        items.data = [{ timestamp: Date.now(), status: operation, tabs: tabs.length }];
      }

      // Now save the updated items using set
      chrome.storage.local.set(items, function () {
        console.log('Data successfully saved to the storage!');
      });

      insert_records({
        timestamp: Date.now(),
        url: tab.url,
        status: operation,
        tabs: tabs.length
      });
    });
  });

}


// This will run when a bookmark is created.
// chrome.bookmarks.onCreated.addListener(function() {
// do something
// });
















// TODO remove after migration finishes
// attach the .equals method to Array's prototype to call it on any array
function equals(array1, array2) {
  var differences = "";

  // if the other array is a falsy value, return
  if (!array1) {
    console.log("First array is null");
    alert("Different");
    return false;
  }

  // if the other array is a falsy value, return
  if (!array2) {
    console.log("Second array is null");
    alert("Different");
    return false;
  }

  // compare lengths - can save a lot of time 
  if (array1.length != array2.length) {
    console.log("Length is diffrent: " + array1.length + ", " + array2.length);
    alert("Different");
    return false;
  }

  for (var i = 0, l = array1.length; i < l; i++) {
    // Check if we have nested arrays
    if (array1[i] instanceof Array && array2[i] instanceof Array) {
      // recurse into the nested arrays
      if (!array1[i].equals(array2[i])) {
        console.log("recurse into the nested arrays false");
        alert("Different");
        return false;
      }
    }

    flag = true
    for (key in array1[i]) {
      if (key === "timestamp") {
        if (Math.abs(array1[i][key] - array2[i][key]) < 10) {
          continue;
        }
      } else if (array1[i][key] == array2[i][key]) {
        continue;
      }

      differences += `Diffs for key ${key}, values: '${array1[i][key]}', '${array2[i][key]}'`;
    }
    if (differences !== "") {
      console.log("DIFFS:", differences);
      alert("Different");
      return false;
    }
  }
  return true;
}

function alert(text) {
  chrome.notifications.create('', {
    title: 'Differences',
    message: 'text',
    type: 'basic',
    iconUrl: 'icon128.png',
    priority: 2
  });
}