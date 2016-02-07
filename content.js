(function (window, document) {
  
  // Listens for "find-version" action and triggers the version finding.
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message === "find-version") {
      if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", findVersionsCallback, true);
      } else {
        findVersionsCallback();
      }  
    }
  });

  /**
   * Callback function which tries to determine the used version 
   * and sends a message back to background.js.
   * 
   * @return {void}
   */
  function findVersionsCallback () {
    var linkElements, foundVersions, version, versionShort, accuracy;

    linkElements  = document.querySelectorAll('link');
    foundVersions = sitevisionVersions(linkElements);

    if (foundVersions.length === 1) {
      // Pretty sure
      version      = foundVersions[0];
      versionShort = shortVersion(version);
      accuracy     = 1;
    } else if (foundVersions.length >= 1) {
      // Inconclusive
      version      = foundVersions[0];
      versionShort = shortVersion(version);
      accuracy     = 0.5;
    } else {
      // Nothing found
      version      = "";
      versionShort = "N/A";
      accuracy     = 0;
    }

    chrome.extension.sendMessage({
      "type": "found-version", 
      "data": {
        "version":      version,
        "versionShort": versionShort,
        "accuracy":     accuracy
      }
    });
  }

  /**
   * Takes an array of DOMElements and tries to find possible versions from the href attribute.
   * Returns a list of versions.
   * 
   * @param  {array} linkElements
   * @return {array}
   */
  function sitevisionVersions (linkElements) {
    var el, href, matches, versions = [];

    for (var i = linkElements.length - 1; i >= 0; i--) {
      el = linkElements[i];
      href = el.getAttribute('href');

      matches = href.match(/\/sitevision\/([\d]+[\w.-]+)\//i);

      if (matches && matches[1] && versions.indexOf(matches[1]) === -1) {
        versions.push(matches[1]);
      }
    };

    return versions;
  }

  /**
   * Takes a full version string and returns MAJOR[.MINOR[.POINT]]
   * 
   * @param  {string} version The full version string
   * @return {string}
   */
  function shortVersion (version) {
    var matches = version.match(/^(\d+\.)?(\d+\.)?(\*|\d+)/i);
    if (matches) {
      return matches[0];
    }
  }

})(window, document);
