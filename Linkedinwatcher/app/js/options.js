var noop = function () { }; // do nothing.

$(function () {
    $("#interval").slider({
        formatter: function (value) {
            return (value === 1) ? value + ' minute' : value + ' minutes';
        },
        tooltip: 'always',
        min: 1,
        max: 200,
        scale: 'logarithmic',
        step: 1
    });

    $("#enableNotification").change(function () {
        var isEnabled = $(this).is(":checked");
        chrome.storage.sync.set({ notification: isEnabled });
    });

    $("#interval")
        .on("slideStop", function (obj) {
            var interval = obj.value;
            chrome.storage.sync.set({ interval: interval });
        });
    setPreferences();
});

function setPreferences() {
    chrome.storage.sync.get({ notification: true, interval: 5 }, function (data) {
        $("#enableNotification").prop("checked", data.notification);
        //        $("#interval").slider("setValue", data.interval);
        $("#interval").slider("setValue", data.interval);
    });
}