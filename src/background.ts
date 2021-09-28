import {insert_records} from './database/Database'

chrome.tabs.onCreated.addListener(function (tab) {
    add('opened', tab);
});

chrome.tabs.onRemoved.addListener(function (tab) {
    add('closed', undefined);
});

function add(operation: string, tab?: chrome.tabs.Tab) {
    // Get all the items stored in the storage
    const timeNow = Date.now();

    chrome.tabs.query({}, function (tabs) {
        console.log('Tabs count: ' + tabs.length);

        chrome.storage.local.get(function (items) {
            console.log('Get from storage');
            console.log(items);
            if (Object.keys(items).length > 0 && items.data) {
                // The data array already exists, add to it the new server and nickname
                items.data.push({ timestamp: timeNow, status: operation, tabs: tabs.length });
            } else {
                // The data array doesn't exist yet, create it
                items.data = [{ timestamp: timeNow, status: operation, tabs: tabs.length }];
            }

            // Now save the updated items using set
            chrome.storage.local.set(items, function () {
                console.log('Data successfully saved to the storage!');
            });
        });

        insert_records({
            timestamp: timeNow,
            url: tab === undefined ? '' : tab.url!,
            status: operation,
            tabs: tabs.length
        });
    });

}


// TODO remove after migration finishes
// attach the .equals method to Array's prototype to call it on any array
// function equals(array1, array2) {
//     var differences = "";

//     // if the other array is a falsy value, return
//     if (!array1) {
//         console.log("First array is null");
//         alert("Different");
//         return false;
//     }

//     // if the other array is a falsy value, return
//     if (!array2) {
//         console.log("Second array is null");
//         alert("Different");
//         return false;
//     }

//     // compare lengths - can save a lot of time 
//     if (array1.length != array2.length) {
//         console.log("Length is different: " + array1.length + ", " + array2.length);
//         alert("Different");
//         return false;
//     }

//     for (var i = 0, l = array1.length; i < l; i++) {
//         // Check if we have nested arrays
//         if (array1[i] instanceof Array && array2[i] instanceof Array) {
//             // recurse into the nested arrays
//             if (!array1[i].equals(array2[i])) {
//                 console.log("recurse into the nested arrays false");
//                 alert("Different");
//                 return false;
//             }
//         }

//         flag = true
//         for (key in array1[i]) {
//             if (key === "timestamp") {
//                 if (Math.abs(array1[i][key] - array2[i][key]) < 50) {
//                     continue;
//                 }
//             } else if (array1[i][key] == array2[i][key]) {
//                 continue;
//             }

//             differences += `Diffs for key ${key}, values: '${array1[i][key]}', '${array2[i][key]}'`;
//         }
//         if (differences !== "") {
//             console.log("DIFFS:", differences);
//             alert("Different");
//             return false;
//         }
//     }
//     return true;
// }

// function alert(text) {
//     chrome.notifications.create('', {
//         title: 'Differences',
//         message: 'text',
//         type: 'basic',
//         iconUrl: 'icon128.png',
//         priority: 2
//     });
// }