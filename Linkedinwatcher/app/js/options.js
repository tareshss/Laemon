var noop = function () { }; // do nothing.

$(function () {
    $("#ex8").slider({
        tooltip: 'always'
    });

    $("#enableNotification").change(function () {
        var isEnabled = $(this).is(":checked");
        chrome.storage.sync.set({ notification: isEnabled, noop });
    });
  setNotificationCheckBox();
});

function setNotificationCheckBox() {
    chrome.storage.sync.get({ notification: true }, function (data) {
        $("#enableNotification").prop("checked", data.notification);
    });
}