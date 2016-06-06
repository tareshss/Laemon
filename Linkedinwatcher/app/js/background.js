var extIcon = "../img/icon.png";
var notificationIcon = "../img/icon.png";
var offineIcon = "../img/icon_offline.png";
var updateUrl = "/inbox/summary";
var messageId = "span.message-count";
var myVar;

function openTab(url, active) {
    chrome.tabs.create({url ,active });
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
    chrome.storage.sync.get({ notification: true},
       function (data) {
           getMessageCount(setBrowserIconCountAndShowUserMessage, data.notification);
       });
 
};

function initialize(showNotification) {
    chrome.storage.sync.get({ notification: true, interval: 5},
        function (data) {
            if (showNotification) {
                getMessageCount(setBrowserIconCountAndShowUserMessage, data.notification);
            } else {
                getMessageCount(setBrowserIconCountAndShowUserMessage, showNotification);
            }
            myVar = setTimeout(function () { initialize(showNotification); }, data.interval * 60 * 1000);
        });
}

function resetInterval() {
    chrome.storage.sync.get({interval: 5 },
        function (data) {
            myVar = setTimeout(resetInterval, data.interval * 60 * 1000);
        });
}

function Main() {
    initialize(true);
    chrome.notifications.onClicked.addListener(function () {
        openLinkedIn();
    });
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (key in changes) {
//            var storageChange = changes[key];
            if (key === "interval") {
                clearTimeout(myVar);
                initialize(false);
                //change setnewTimeout without check

            }
//            console.log('Storage key "%s" in namespace "%s" changed. ' +
//                     'Old value was "%s", new value is "%s".',
//                     key,
//                     namespace,
//                     storageChange.oldValue,
//                     storageChange.newValue);
        }
    });
}

Main();
