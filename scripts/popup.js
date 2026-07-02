import { BlockListRepository } from "./block_list/block_list_repository.js";
import { PresetRepository } from "./preset/preset_repository.js";

async function loadActivePresets() {
  const activePresets = await PresetRepository.getAllPresets(true);
  if (!activePresets || activePresets.length === 0) return;

  const activePresetsListElement = document.getElementById("activePresets");
  if (!activePresetsListElement) return;

  activePresets.forEach((preset) => {
    const listItemElement = document.createElement("li");
    listItemElement.innerText = preset.getName();
    activePresetsListElement.appendChild(listItemElement);
  });
}

async function loadCustomUrls() {
  const repoBlockLists = await BlockListRepository.getAllLists();
  const allBlockedUrls = repoBlockLists.flatMap((blockList) =>
    blockList.getUrls(),
  );

  if (!allBlockedUrls || allBlockedUrls.length === 0) return;

  const customUrlsListElement = document.getElementById("urlList");
  if (!customUrlsListElement) return;

  allBlockedUrls.forEach((url) => {
    const listItemElement = document.createElement("li");
    listItemElement.innerText = url;
    customUrlsListElement.appendChild(listItemElement);
  });
}

function initialize() {
  loadActivePresets();
  loadCustomUrls();
}

initialize();
