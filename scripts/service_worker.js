const isUrlBlocked = (url) => {
  const blockList = ["twitch.tv", "youtube.com"];
  const isBlocked = blockList.some((blockedUrl) => url.includes(blockedUrl));

  return isBlocked;
};

chrome.webNavigation.onCompleted.addListener((details) => {
  const url = details.url;
  const tabId = details.tabId;
  if (url) {
    if (isUrlBlocked(url)) {
      chrome.tabs.update(tabId, { url: "https://google.com/" });
    }
  }
});
