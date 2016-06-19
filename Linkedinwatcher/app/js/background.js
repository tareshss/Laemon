var extIcon = "../img/icon.png";
var notificationIcon = "../img/icon.png";
var offineIcon = "../img/icon_offline.png";
var updateUrl = "/inbox/summary";
var messageId = "span.message-count";
var myVar;

//Set click to false at beginning
var alreadyClicked = false;
//Declare a timer variable
var timer;


function openTab(url, active) {
    chrome.tabs.create({ url, active });
}

function getLinkedInUrl() {
    return "https://www.linkedin.com";
}

function getSummaryUrl() {
    return getLinkedInUrl() + updateUrl;
}

function openLinkedIn() {
    openTab(getLinkedInUrl(), true);
};

function setOfflineIcon() {
    chrome.browserAction.setIcon({
        path: offineIcon
    });
    chrome.browserAction.setBadgeText({ text: "" });
}

function getMessageCount(callback, showNotifcation) {
    $.get(getSummaryUrl(),
        function (data) {
            var count = $(data).find(messageId).text();
            if (count.length > 0 || (Math.floor(count) === count && $.isNumeric(count))) {
                callback(count, showNotifcation);
            }
            else {
                setOfflineIcon();
            }
        }
    );
}

function setBrowserIconCountAndShowUserMessage(result, showNotifcation) {
    setBrowserIcon(result);
    if (showNotifcation && result > 0)
        showUserMessage(result);
};

function setBrowserIcon(result) {
    var badgeText = (result > 0) ? result : "";
    chrome.browserAction.setIcon({
        path: extIcon
    });
    chrome.browserAction.setBadgeText({ text: badgeText });
}

function showUserMessage(result) {
    var addPlural = (result === "1") ? "" : "s";
    var opt = {
        type: "basic",
        title: chrome.i18n.getMessage("name"),
        message: "You have " + result + " New Message" + addPlural,
        iconUrl: notificationIcon,
        priority: 0
    }
    chrome.notifications.create("new message", opt);
}

function checkLinkedIn() {
    chrome.storage.sync.get({ notification: true },
       function (data) {
           getMessageCount(setBrowserIconCountAndShowUserMessage, data.notification);
       });

};

function initialize() {
    chrome.storage.sync.get({ notification: true, interval: 5 },
        function (data) {
            getMessageCount(setBrowserIconCountAndShowUserMessage, data.notification);
            myVar = setTimeout(initialize, data.interval * 60 * 1000);
        });
}

function resetInterval() {
    chrome.storage.sync.get({ interval: 5 },
        function (data) {
            myVar = setTimeout(initialize, data.interval * 60 * 1000);
        });
}

function disableMenu() {
    chrome.storage.sync.get({ menu: true },
        function (data) {
            if (data.menu) {
                chrome.browserAction.setPopup({ popup: "html/popup.html" });
            } else {
                chrome.browserAction.setPopup({ popup: "" });
            }
        });
}

function singleDoubleClickListener(tab) {
    //Check for previous click
    if (alreadyClicked) {
        //Yes, Previous Click Detected

        //Clear timer already set in earlier Click
        clearTimeout(timer);
        console.log("Double click");

        //Clear all Clicks
        alreadyClicked = false;
        return;
    }

    //Set Click to  true
    alreadyClicked = true;

    //Add a timer to detect next click to a sample of 250
    timer = setTimeout(function () {
        //No more clicks so, this is a single click
        console.log("Single click");

        //Clear all timers
        clearTimeout(timer);

        //Ignore clicks
        alreadyClicked = false;
    },
        300);
}

function setSingleDoubleClick() {
    chrome.storage.sync.get({ menu: true },
      function (data) {
          //Add Default Listener provided by chrome.api.*
          if (!data.menu) {
              chrome.browserAction.onClicked.addListener(singleDoubleClickListener);
          } else {
              chrome.extension.onRequest.removeListener(singleDoubleClickListener);
              clearTimeout(timer);
              alreadyClicked = false;
          }
      });
}
function Main() {
    initialize();
    chrome.notifications.onClicked.addListener(function () {
        openLinkedIn();
    });
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        var key;
        for (key in changes) {
            if (changes.hasOwnProperty(key)) {
                if (key === "interval") {
                    clearTimeout(myVar);
                    resetInterval();
                }
                if (key === "menu") {
                    disableMenu();
                    setSingleDoubleClick();
                }
            }
        }
    });
    disableMenu();
    setSingleDoubleClick();
}

Main();
