
"use strict";
$(function () {
    chrome.runtime.getBackgroundPage(function (backgroundPage) {
        $("#openLinkedIn")
            .on("click",
                function () {
                    backgroundPage.openLinkedIn();
                    window.close();
                });
        $("#checkMessages")
            .on("click",
                function () {
                    backgroundPage.checkLinkedIn();
                    window.close();
                });
        $("#settings")
            .on("click",
                function () {
                    backgroundPage.openTab("../html/settings.html", true);
                });
        $("#about")
            .on("click",
                function () {
                    backgroundPage.openTab("../html/about.html", true);
                });
    });
});
