var interval = 15; // mins

function getLinkedInUrl() {
    return "https://www.linkedin.com";
}

function getSummaryUrl() {
    return getLinkedInUrl() + "/inbox/summary";
}

function openLinkedIn() {
    chrome.tabs.create({ url: getLinkedInUrl(), active: true });
};

function setOfflineIcon() {
    chrome.browserAction.setIcon({
        path: "img/icon_offline.png"
    });
    chrome.browserAction.setBadgeText({ text: "" });
}

function getMessageCount(callback, showNotifcation) {
    $.get(getSummaryUrl(),
        function(data) {
            var count = $(data).find("span.message-count").text();
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
    if (showNotifcation === 1 && result > 0)
        showUserMessage(result);
};

function setBrowserIcon(result) {
    var badgeText = (result > 0) ? result : "";
    chrome.browserAction.setIcon({
        path: "img/icon.png"
    });
    chrome.browserAction.setBadgeText({ text: badgeText });
}

function showUserMessage(result) {
    var addPlural = (result === "1") ? "" : "s";
    var opt = {
        type: "basic",
        title: "Laemon, notifier for LinkedIn™",
        message: "You have " + result + " New Message" + addPlural,
        iconUrl: "../img/icon.png",
        priority: 0
    }
    chrome.notifications.create("new message", opt);
}

function checkLinkedIn() {
    getMessageCount(setBrowserIconCountAndShowUserMessage, 1);
};

 //Checkmail (without notification?) and set box, options? to local storage
function fnInterval() {
    getMessageCount(setBrowserIconCountAndShowUserMessage, 1);
}

function Main() {
    getMessageCount(setBrowserIconCountAndShowUserMessage, 0);
    setInterval(fnInterval, interval * 60 * 1000);
    chrome.notifications.onClicked.addListener(function() {
        openLinkedIn();
    });
}

Main();
