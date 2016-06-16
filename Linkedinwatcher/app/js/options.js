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
            classToAdd = "icon-check";
        } else {
            classToRemove = "icon-check";
            classToAdd = "icon-check-empty";
        }
        $("#enableNotificationLabel").removeClass(classToRemove).addClass(classToAdd);
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
    chrome.storage.sync.get({ notification: true, interval: 5 }, function (data) {
        $("#enableNotification").prop("checked", data.notification);
        var classToRemove, classToAdd;
        if (data.notification) {
            classToRemove = "icon-check-empty";
            classToAdd = "icon-check";
        } else {
            classToRemove = "icon-check";
            classToAdd = "icon-check-empty";
        }
        $("#enableNotificationLabel").removeClass(classToRemove).addClass(classToAdd);

        $("#interval").slider("setValue", data.interval);
    });
}