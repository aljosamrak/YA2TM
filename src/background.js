chrome.runtime.onInstalled.addListener(details => {
  // if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
  //   chrome.runtime.setUninstallURL('https://example.com/extension-survey');
  // }

  // chrome.windows.getCurrent({ 'populate': true }, function (window) {
		// chrome.browserAction.setBadgeText(chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_NONE}).size());
	// });

  
});

chrome.tabs.onCreated.addListener(function(tab) {  
  /*console.log("Tab opened1");
  // localStorage.setItem("tabid", tab.id);
  
  
  
  
  
  
  
  // Get all the items stored in the storage
  chrome.storage.local.get(function(items) {
    console.log('Get from storage');
    console.log(items);
    
    
    chrome.tabs.query({}, function(tabs) {
      console.log('Tabs count: ' + tabs.length);
    
      if (Object.keys(items).length > 0 && items.data) {
          // The data array already exists, add to it the new server and nickname
          items.data.push({timestamp: Date.now(), status: 'opened', tabs: tabs.length});
      } else {
          // The data array doesn't exist yet, create it
          items.data = [{timestamp: Date.now(), status: 'opened', tabs: tabs.length}];
      }

      // Now save the updated items using set
      chrome.storage.local.set(items, function() {
          console.log('Data successfully saved to the storage!');
      });
    });
  });*/
  
  add('opened');
});


chrome.tabs.onRemoved.addListener(function(tab) {
/*
// Get all the items stored in the storage
  chrome.storage.local.get(function(items) {
    console.log('Get from storage');
    console.log(items);
    
    
    chrome.tabs.query({}, function(tabs) {
      console.log('Tabs count: ' + tabs.length);
      if (Object.keys(items).length > 0 && items.data) {
          // The data array already exists, add to it the new server and nickname
          items.data.push({timestamp: Date.now(), status: 'closed', tabs: tabs.length});
      } else {
          // The data array doesn't exist yet, create it
          items.data = [{timestamp: Date.now(), status: 'closed', tabs: tabs.length}];
      }

      // Now save the updated items using set
      chrome.storage.local.set(items, function() {
          console.log('Data successfully saved to the storage!');
      });    
    });
  });*/
  
  add('closed');
});



function add(operation){
 /*
  //###############################################################################################
  // Get all the items stored in the storage
  var tabsHistory = JSON.parse(localStorage.getItem('tabHistory1')||"[]");
  
  console.log('Get from storage------------------------');
  console.log(localStorage.getObject('tabHistory1'));
  console.log(typeof tabsHistory);
  console.log(tabsHistory);


  chrome.tabs.query({}, function(tabs) {
    console.log('Tabs count: ' + tabs.length);
  
    // The data array already exists, add to it the new server and nickname
    tabsHistory.push({timestamp: Date.now(), status: operation, tabs: tabs.length});
    
    console.log('After');
    console.log(tabsHistory);

    // Now save the updated items using set
  	localStorage.setItem('tabHistory1', JSON.stringify(tabsHistory));
  });
  //############################################################################################### 
  */
  
  // Get all the items stored in the storage
  chrome.storage.local.get(function(items) {
    console.log('Get from storage');
    console.log(items);
    
    
    chrome.tabs.query({}, function(tabs) {
      console.log('Tabs count: ' + tabs.length);
    
      if (Object.keys(items).length > 0 && items.data) {
          // The data array already exists, add to it the new server and nickname
          items.data.push({timestamp: Date.now(), status: operation, tabs: tabs.length});
      } else {
          // The data array doesn't exist yet, create it
          items.data = [{timestamp: Date.now(), status: operation, tabs: tabs.length}];
      }

      // Now save the updated items using set
      chrome.storage.local.set(items, function() {
          console.log('Data successfully saved to the storage!');
      });
    });
  });
}


// This will run when a bookmark is created.
// chrome.bookmarks.onCreated.addListener(function() {
  // do something
// });
