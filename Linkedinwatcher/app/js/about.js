$(function () {
    var manifest = chrome.runtime.getManifest();
    $("#version").text(manifest.version);
});