var interval = 15; // mins
var extIcon = "../img/icon.png";
var notificationIcon = "../img/icon.png";
var offineIcon = "../img/icon_offline.png";
var updateUrl = "/inbox/summary";
var messageId = "span.message-count";

function getLinkedInUrl() {
    return "https://www.linkedin.com";
}

function getSummaryUrl() {
    return getLinkedInUrl() + updateUrl;
}

function openLinkedIn() {
    chrome.tabs.create({ url: getLinkedInUrl(), active: true });
};

function setOfflineIcon() {
    chrome.browserAction.setIcon({
        path: offineIcon
    });
    chrome.browserAction.setBadgeText({ text: "" });
}

function getMessageCount(callback, showNotifcation) {
    $.get(getSummaryUrl(),
        function(data) {
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
    getMessageCount(setBrowserIconCountAndShowUserMessage, true);
};

 //Checkmail (without notification?) and set box, options? to local storage
function fnInterval() {
    getMessageCount(setBrowserIconCountAndShowUserMessage, true);
}

function Main() {
    getMessageCount(setBrowserIconCountAndShowUserMessage, false);
    setInterval(fnInterval, interval * 60 * 1000);
    chrome.notifications.onClicked.addListener(function() {
        openLinkedIn();
    });
}

Main();
