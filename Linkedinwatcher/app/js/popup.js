
// Run script as soon as the document's DOM is ready.
"use strict";
document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.getBackgroundPage(function (backgroundPage) {
        $("#openLinkedIn").on("click",function () {
            backgroundPage.openLinkedIn();
            window.close();
        });
        $("#checkMessages").on("click", function () {
            backgroundPage.checkLinkedIn();
            window.close();
        });

    });
});
