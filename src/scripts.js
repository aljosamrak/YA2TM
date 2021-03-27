Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
    return this.getItem(key) && JSON.parse(this.getItem(key));
};

function addListeners() {

	var storeURL = 'https://chrome.google.com/webstore/detail/fhnegjjodccfaliddboelcleikbmapik';

	$('social-fb').observe('click', function(event) {
		event.stop();

		chrome.windows.create({
			'url': 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(storeURL) + '&t=' + encodeURIComponent('I have ' + localStorage.getObject('tabsOpen').toString() + ' open & ' + localStorage.getObject('tabsTotal').toString() + ' all-time-opened browser tabs.'),
			'type': 'popup'
		});
	});

	$('social-twitter').observe('click', function(event) {
		event.stop();

		chrome.windows.create({
			'url': 'http://twitter.com/home?status=' + encodeURIComponent('Current browser tabs count: ' + localStorage.getObject('tabsOpen').toString() + ' open & ' + localStorage.getObject('tabsTotal').toString() + ' all-time opened tabs. //via bit.ly/ptSWJu #chrome'),
			'type': 'popup'
		});
	});

	$('reset-all-tabs').observe('click', function(event) {
		event.stop();

		resetTabTotalCount();
  	});

	$('reset-max-tabs').observe('click', function(event) {
		event.stop();
		  
  		resetTabMaxCount();
	});

  $('iconBgColor').observe('change', function(event) {
    event.stop();

    updateIconBgColorInput();
  });
  
  //-----
  $(function () {
    $('#example').datetimepicker();
  });
  
  
  
  
  
  $('.input-daterange').datepicker({
format: 'dd-mm-yyyy',
todayHighlight: true,
startDate: '0d'
});

  //----
}

function init() {

	localStorage.setObject('windowsOpen', 0);
	localStorage.setObject('tabsOpen', 0);
	localStorage.setObject('tabsWindowCurrentOpen', 0);

	var tabsTotal = localStorage.getObject('tabsTotal');
	if (!tabsTotal)
		localStorage.setObject('tabsTotal', 0);

	var tabsMax = localStorage.getObject('tabsMax');
	if (!tabsMax)
		localStorage.setObject('tabsMax', 0);

	chrome.tabs.onCreated.addListener(function() {
		incrementTabOpenCount(1);
	});

	chrome.tabs.onRemoved.addListener(function() {
		decrementTabOpenCount();
	});

	chrome.windows.onCreated.addListener(function() {
		incrementWindowOpenCount();
	});

	chrome.windows.onRemoved.addListener(function() {
		decrementWindowOpenCount();
	});

    chrome.windows.onFocusChanged.addListener(function() {
        updateWindowCurrentCount();
    });
  
    getCurrentWindowTabCount();
	updateTabTotalCount();
}

function incrementWindowOpenCount(count) {

	if (!count)
		count = 1;

	localStorage.setObject('windowsOpen', localStorage.getObject('windowsOpen') + count);

	updateTabOpenCount();
}

function decrementWindowOpenCount() {
	localStorage.setObject('windowsOpen', localStorage.getObject('windowsOpen') - 1);

	updateTabOpenCount();
}

function incrementTabOpenCount(count) {

	if (!count)
		count = 1;

	localStorage.setObject('tabsOpen', localStorage.getObject('tabsOpen') + count);
	localStorage.setObject('tabsTotal', localStorage.getObject('tabsTotal') + count);

	var tabsOpen = localStorage.getObject('tabsOpen');
	var tabsMax = localStorage.getObject('tabsMax');
	if (tabsOpen > tabsMax) {
		localStorage.setObject('tabsMax', tabsOpen);
	}

	updateTabOpenCount();
}


function decrementTabOpenCount() {
	localStorage.setObject('tabsOpen', localStorage.getObject('tabsOpen') - 1);

	updateTabOpenCount();
}


function updateTabOpenCount() {
	chrome.browserAction.setBadgeText({text: localStorage.getObject('tabsOpen').toString()});
  //chrome.browserAction.setBadgeBackgroundColor({ "color": [89, 65, 0, 255] });
  chrome.browserAction.setBadgeBackgroundColor({ color: localStorage.getObject('iconBgColor').toString() });
}

function resetTabTotalCount() {
	localStorage.setObject('tabsTotal', 0);
	localStorage.setObject('tabHistory', new Array());

	updatePopupCounts();
}

function resetTabMaxCount() {
	localStorage.setObject('tabsMax', 0);

	updatePopupCounts();
}

function getCurrentWindowTabCount() {
  chrome.windows.getCurrent({ 'populate': true }, function(window) {
    localStorage.setObject('tabsWindowCurrentOpen', window.tabs.size());
  });
}
function updateWindowCurrentCount() {
  getCurrentWindowTabCount();

  updatePopupCounts();
}

function updateTabTotalCount() {
	chrome.windows.getAll({ 'populate': true }, function(windows) {
		incrementWindowOpenCount(windows.size());

		windows.each(function(window) {
			incrementTabOpenCount(window.tabs.size());
		});
	});
}

function updateIconBgColorInput() {
  localStorage.setObject('iconBgColor', $('iconBgColor').value);
  updateTabOpenCount();
}

//##################################################################################################
//##################################################################################################
//##################################################################################################
function calculate(startTime, endTime) {


  chrome.storage.local.get(function(items) {
    console.log('Get from storage--------');
    console.log('Start time: ' + startTime);
    console.log('End time:   ' + endTime);
    console.log(items);
    
    console.log('Tabs count: ' + items.length);
    console.log(typeof items);
    console.log(items);
//    var a = items.length;
    var timeFiltered = items.data.filter(tab => tab.timestamp >= startTime && tab.timestamp <= endTime);
    var opened = timeFiltered.filter(tab => tab.status === 'opened');
    var closed = timeFiltered.filter(tab => tab.status === 'closed');
    
    console.log('Filter');
    console.log(timeFiltered);
    
    console.log('opened');
    console.log(opened);
    
    console.log('closed');
    console.log(closed);
    
      
    $$('.weekOpened').invoke('update', opened.length);
    $$('.weekClosed').invoke('update', closed.length);
    $$('.weekDiff').invoke('update', opened.length - closed.length);
    
  });
}
//##################################################################################################
//##################################################################################################
//##################################################################################################

function updatePopupCounts() {
  $$('.maxCounter').invoke('update', localStorage.getObject('tabsMax'));
  $$('.totalCounter').invoke('update', localStorage.getObject('tabsTotal'));
  $$('.totalOpen').invoke('update', localStorage.getObject('tabsOpen'));
  $$('.windowsOpen').invoke('update', localStorage.getObject('windowsOpen'));
  $$('.windowCurrentOpen').invoke('update', localStorage.getObject('tabsWindowCurrentOpen'));
  
  
  var currectTime = Date.now();  
  var previousWeekTime = new Date();
  previousWeekTime.setDate(previousWeekTime.getDate() - 7);
  
  /*
  $$('.weekOpened').invoke('update', calculate(previousWeekTime, currectTime));
  $$('.weekCloseed').invoke('update', calculate(previousWeekTime, currectTime));
*/
  calculate(previousWeekTime.getTime(), currectTime)

  var iconInput = $('iconBgColor');
  if (iconInput) {
    iconInput.value = localStorage.getObject('iconBgColor').toString();
  }
}

function initPopup() {
  updatePopupCounts();

	addListeners();
}
