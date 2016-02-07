(function () {

  chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.sendMessage(activeInfo.tabId, "find-version");
  });

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    chrome.tabs.sendMessage(tabId, "find-version");
  });

  chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "dom-loaded") {
      chrome.browserAction.setBadgeText({
        "text": request.data.versionShort
      });
      chrome.browserAction.setBadgeBackgroundColor({
        "color": accuracyColor(request.data.accuracy)
      });
    }
    return true;
  });

  function accuracyColor (accuracy) {
    var color;

    if (accuracy === 1) {
      color = '#0f0';
    } else if (accuracy >= 0.7) {
      color = '#0ff';
    } else if (accuracy >= 0.4) {
      color = '#f00';
    } else {      
      color = '#f00';
    }

    return color;
  }
  
})();
