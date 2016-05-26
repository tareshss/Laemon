var interval = 5; // 5 mins

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
    chrome.browserAction.setBadgeText({ text: result });
    var opt = {
        type: "basic",
        title: "New Message",
        message: "You have a new Message",
        iconUrl: "../img/icon.png",
        priority: 0
    }
    chrome.notifications.create('new message', opt);
};

function checkLinkedIn() {
    $.get("https://www.linkedin.com/inbox/summary",
        function (data) {
//            var topBar = $(data).find("#top-header").find("#account-nav").html();
//                        console.log(topBar);
            var count = $(data).find("span.message-count").text();
//                .find("#top-header")
//                .find("#account-nav")
//                .find('li[data-li-activity-type="messages"]')
//                                .attr("data-li-new-count");
//                .find("#header-messages-count")
//                .html();
//                .find("#header-messages-count")
//                .text();
//                .find("span.message-count")
            //                .text();
            //            console.log(topBar);
//            console.log(data);
//            console.log(count);
            
            // Check if value is integer?
            // Check if valid value i.e > 0 and < 9999
            chrome.browserAction.setBadgeText({ text: count });
            var opt = {
                type: "basic",
                title: "New Message",
                message: "You have a new Message",
                iconUrl: "../img/icon.png",
                priority: 0
            }
            chrome.notifications.create('new message', opt);
        });
//    $.ajax({
//        url: "https://www.linkedin.com/",
//        type: 'GET',
//        success: function (data) {
//            console.log(data);
//        }
//    });

};

 //Checkmail (without notification?) and set default options to local storage
 //chrome.storage.local.clear();
function fn60sec() {
    getMessageCount(setBrowserIconCountAndShowUserMessage);
}

setInterval(fn60sec, interval * 60 * 1000);