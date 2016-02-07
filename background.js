(function () {

  // Triggers a "find version" action when switching tab.
  chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.sendMessage(activeInfo.tabId, "find-version");
  });

  // Triggers a "find version" action when a tab gets a new URL.
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    chrome.tabs.sendMessage(tabId, "find-version");
  });

  // Listens for the found version and updates the extension badge.
  chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "found-version") {
      chrome.browserAction.setBadgeText({
        "text": request.data.versionShort
      });
      chrome.browserAction.setBadgeBackgroundColor({
        "color": accuracyColor(request.data.accuracy)
      });
    }
    return true;
  });

  /**
   * Returns a hex color based on the accuracy.
   * 
   * @param  {float} accuracy The accuracy of the found version. 0.0 - 1.0
   * @return {string}
   */
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
