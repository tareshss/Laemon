var noop = function () { }; // do nothing.

$(function () {
    $("#interval").slider({
        formatter: function (value) {
            if (value === 301)
                return "Never";
            else if (value > 59) {
                var hours = Math.floor(value / 60);
                var minutes = value % 60;
                return (minutes !== 0)? hours + " hours and " + minutes + " minutes":  (hours === 1)?  hours + " hour" : hours + " hours";
            }
                
            return (value === 1) ? value + " minute" : value + " minutes";
        },
        tooltip: 'always',
        min: 1,
        max: 301,
        scale: 'logarithmic',
        step: 1,
        ticks: [1, 15, 301],
        ticks_labels: ["Often", "Sometimes", "Never"]
    });

    $("#enableNotification").change(function () {
        var isEnabled = $(this).is(":checked");
        chrome.storage.sync.set({ notification: isEnabled });
        var classToRemove, classToAdd;
        if (isEnabled) {
            classToRemove = "icon-check-empty";
            classToAdd = "icon-check laemon-selected";
        } else {
            classToRemove = "icon-check laemon-selected";
            classToAdd = "icon-check-empty";
        }
        $("#enableNotificationLabel").removeClass(classToRemove).addClass(classToAdd);
    });

    $("#enableMenu").change(function () {
        var isEnabled = $(this).is(":checked");
        chrome.storage.sync.set({ menu: isEnabled });
        var classToRemove2, classToAdd2;
        if (isEnabled) {
            classToRemove2 = "icon-check-empty";
            classToAdd2 = "icon-check laemon-selected";
        } else {
            classToRemove2 = "icon-check laemon-selected";
            classToAdd2 = "icon-check-empty";
        }
        $("#enableMenuLabel").removeClass(classToRemove2).addClass(classToAdd2);
    });

    $("#interval")
        .on("slideStop", function (obj) {
            var interval = obj.value;
            if (interval === 301)
                interval = 9999;
            chrome.storage.sync.set({ interval: interval });
        });
    setPreferences();
});

function setPreferences() {
    chrome.storage.sync.get({ notification: true, interval: 5, menu: true }, function (data) {

        $("#enableNotification").prop("checked", data.notification);
        var classToRemove, classToAdd;
        if (data.notification) {
            classToRemove = "icon-check-empty";
            classToAdd = "icon-check laemon-selected";
        } else {
            classToRemove = "icon-check laemon-selected";
            classToAdd = "icon-check-empty";
        }
        $("#enableNotificationLabel").removeClass(classToRemove).addClass(classToAdd);

        $("#enableMenu").prop("checked", data.menu);
        var classToRemove2, classToAdd2;
        if (data.menu) {
            classToRemove2 = "icon-check-empty";
            classToAdd2 = "icon-check laemon-selected";
        } else {
            classToRemove2 = "icon-check laemon-selected";
            classToAdd2 = "icon-check-empty";
        }
        $("#enableMenuLabel").removeClass(classToRemove2).addClass(classToAdd2);

        $("#interval").slider("setValue", data.interval);
    });
}