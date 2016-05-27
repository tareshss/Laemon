var interval = 150; // mins

function openLinkedIn() {
    chrome.tabs.create({ url: "https://www.linkedin.com", active: true });
};

function getMessageCount(callback) {
    $.get("https://www.linkedin.com/inbox/summary",
        function(data) {
            var count = $(data).find("span.message-count").text();
            callback(count);
        }
    );
}

function setBrowserIconCountAndShowUserMessage(result) {
    setBrowserIcon(result);
    showUserMessage();
};

function setBrowserIcon(result) {
    chrome.browserAction.setBadgeText({ text: result });
}

function showUserMessage() {
    var opt = {
        type: "basic",
        title: "New Message",
        message: "You have a new Message",
        iconUrl: "../img/icon.png",
        priority: 0
    }
    chrome.notifications.create('new message', opt);
}

function checkLinkedIn() {
    getMessageCount(setBrowserIconCountAndShowUserMessage);
};

 //Checkmail (without notification?) and set box, options? to local storage
function fn60sec() {
    getMessageCount(setBrowserIconCountAndShowUserMessage);
}

getMessageCount(setBrowserIconCountAndShowUserMessage);
setInterval(fn60sec, interval * 60 * 1000);