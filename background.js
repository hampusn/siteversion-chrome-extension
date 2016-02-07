(function () {

  // Holds the last tabId which we triggered the "find-version" action for.
  var lastTabId;

  // Triggers a "find version" action when switching tab.
  chrome.tabs.onActivated.addListener(function (activeInfo) {
    sendFindAction(activeInfo.tabId);
  });

  // Triggers a "find version" action when a tab gets a new URL.
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    sendFindAction(tabId);
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

  function sendFindAction (tabId) {
    if (tabId === lastTabId) {
      return; // Already sent message for current tab. No need to update version again.
    }

    chrome.tabs.sendMessage(tabId, "find-version");
    lastTabId = tabId;
  }

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
