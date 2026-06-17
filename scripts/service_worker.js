import { BlockList } from "./block_list/block_list.js";
import { BlockListRepository } from "./block_list/block_list_repository.js";
import { BlockShorts } from "./block_shorts.js";
import { defaultPresets } from "./preset/default_presets.js";
import { PresetRepository } from "./preset/preset_repository.js";

async function isUrlBlocked(url) {
  const repoBlockLists = await BlockListRepository.getAllLists();
  const allBlockedUrls = repoBlockLists.flatMap((blockList) =>
    blockList.getUrls(),
  );

  const blockShortsInstance = await BlockShorts.getInstance();
  const isShortsBlocked = await blockShortsInstance.getValue();

  if (isShortsBlocked) allBlockedUrls.push("*://*.youtube.com/shorts");

  const activePresetUrls = await PresetRepository.getAllUrls(true);
  allBlockedUrls.push(...activePresetUrls);

  try {
    const currentUrl = new URL(url);
    const fullPath = currentUrl.origin + currentUrl.pathname;

    const isBlocked = allBlockedUrls.some((blockedPattern) => {
      const regexPattern = blockedPattern
        .replace(/\./g, "\\.")
        .replace(/\//g, "\\/")
        .replace(/\*/g, ".*");

      const regex = new RegExp(regexPattern);
      return regex.test(fullPath);
    });

    return isBlocked;
  } catch (e) {
    console.error("[isUrlBlocked] Invalid URL:", url, e);
    return false;
  }
}

function checkAndRedirect(details) {
  const { url, tabId, documentLifecycle } = details;
  if (!url) return;
  if (documentLifecycle === "prerender") return;

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

async function initBlockList() {
  const repoUserBlockList = await BlockListRepository.getBlockList("_user");
  if (!repoUserBlockList) {
    const userBlockList = new BlockList("_user");
    await BlockListRepository.saveBlockList(userBlockList);
  }
}

async function initDefaultPresets() {
  const allDefaultPresets = Object.values(defaultPresets);

  for (let i = 0; i < allDefaultPresets.length; i++) {
    const preset = allDefaultPresets[i];
    const isSaved =
      (await PresetRepository.getPreset(preset.getName())) !== undefined;

    if (!isSaved) {
      await PresetRepository.savePreset(preset);
    }
  }
}

function initialize() {
  initBlockList();
  initBlockShorts();
  initDefaultPresets();

  chrome.webNavigation.onCompleted.addListener(checkAndRedirect);
  chrome.webNavigation.onHistoryStateUpdated.addListener(checkAndRedirect);
}

initialize();
