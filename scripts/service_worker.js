import { BlockList } from "./block_list.js";
import { BlockShorts } from "./block_shorts.js";

async function isUrlBlocked(url) {
  const blockListInstance = await BlockList.getInstance();
  const blockList = await blockListInstance.getUrls();

  const blockShortsInstance = await BlockShorts.getInstance();
  const isShortsBlocked = await blockShortsInstance.getValue();

  if (isShortsBlocked) blockList.push("*://*.youtube.com/shorts");

  try {
    const currentUrl = new URL(url);
    const fullPath = currentUrl.origin + currentUrl.pathname;

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
    if (isBlocked) chrome.tabs.update(tabId, { url: "blocked.html" });
  });
}

async function initBlockShorts() {
  const blockShortsInstance = await BlockShorts.getInstance();
  const isBlocked = await blockShortsInstance.getValue();
  const hasRegisteredScript = await blockShortsInstance.hasRegisteredScript();

  if (isBlocked === undefined) return;

  if (isBlocked) {
    await blockShortsInstance.registerScript();
  } else {
    await blockShortsInstance.unregisterScript();
  }
}

function initialize() {
  initBlockShorts();

  chrome.webNavigation.onCompleted.addListener(checkAndRedirect);
  chrome.webNavigation.onHistoryStateUpdated.addListener(checkAndRedirect);
}

initialize();
