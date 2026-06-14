import { BlockList } from "./block_list.js";

async function isUrlBlocked(url) {
  const blockListInstance = await BlockList.getInstance();
  const blockList = await blockListInstance.getUrls();

  try {
    const currentUrl = new URL(url);
    const fullPath = currentUrl.hostname + currentUrl.pathname;

    const isBlocked = blockList.some((blockedPattern) => {
      const regexPattern = blockedPattern
        .replace(/\./g, "\\.")
        .replace(/\//g, "\\/")
        .replace(/\*/g, ".*");

      const regex = new RegExp(regexPattern);
      return regex.test(fullPath);
    });

    return isBlocked;
  } catch (e) {
    console.error("Invalid URL:", url, e);
    return false;
  }
}

function checkAndRedirect(details) {
  const { url, tabId } = details;
  if (!url) return;

  isUrlBlocked(url).then((isBlocked) => {
    if (isBlocked) chrome.tabs.update(tabId, { url: "https://google.com/" });
  });
}

chrome.webNavigation.onCompleted.addListener(checkAndRedirect);
chrome.webNavigation.onHistoryStateUpdated.addListener(checkAndRedirect);
