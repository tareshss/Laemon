
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
        $("#options")
            .on("click",
                function () {
                    if (chrome.runtime.openOptionsPage) {
                        // New way to open options pages, if supported (Chrome 42+).
                        chrome.runtime.openOptionsPage();
                    } else {
                        // Reasonable fallback.
                        window.open(chrome.runtime.getURL('../html/options.html'));
                    }
                    backgroundPage.openTab("../html/options.html", true);
                });
        $("#about")
            .on("click",
                function () {
                    backgroundPage.openTab("../html/about.html", true);
                });
    });
});
