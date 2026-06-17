import { BlockList } from "./block_list/block_list.js";
import { BlockListRepository } from "./block_list/block_list_repository.js";
import { BlockShorts } from "./block_shorts.js";
import { isUrl } from "./helpers.js";
import { PresetRepository } from "./preset/preset_repository.js";

function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

async function loadShortsInputValue() {
  const inputElement = document.getElementById("shortsInput");
  const blockShortsInstance = await BlockShorts.getInstance();
  const blockShortsValue = await blockShortsInstance.getValue();

  if (inputElement) {
    inputElement.checked = blockShortsValue;
  }
}

async function handleShortsInput(e) {
  const isChecked = e.target.checked;

  const blockShortsInstance = await BlockShorts.getInstance();
  blockShortsInstance.setValue(isChecked);
  if (isChecked) {
    await blockShortsInstance.registerScript();
  } else {
    await blockShortsInstance.unregisterScript();
  }
}

async function loadList() {
  const listElement = document.getElementById("list");
  const repoUserBlockList = await BlockListRepository.getBlockList("_user");

  if (!repoUserBlockList) return;

  removeAllChildren(listElement);

  repoUserBlockList.getUrls().forEach((url, index) => {
    const urlElement = document.createElement("ul");
    const removeButton = document.createElement("button");
    removeButton.innerText = "remove";
    removeButton.addEventListener("click", async () => {
      repoUserBlockList.removeAtIndex(index);
      await BlockListRepository.saveBlockList(repoUserBlockList);
      await loadList();
    });
    urlElement.innerText = url;
    urlElement.appendChild(removeButton);

    listElement.appendChild(urlElement);
  });
}

async function handlePresetInput(e, preset) {
  if (!PresetRepository.isValidPreset(preset))
    throw new Error(
      "[handlePresetInput] argument preset is not a valid Preset",
    );
  const isChecked = e.target.checked;

  preset.setStatus(isChecked);
  await PresetRepository.savePreset(preset);
}

async function loadPresetList() {
  const listElement = document.getElementById("presetList");
  const repoPresetList = await PresetRepository.getAllPresets();

  if (!repoPresetList) return;

  removeAllChildren(listElement);

  repoPresetList.forEach((preset) => {
    const presetId = "preset-" + preset.getName();
    const wrapperElement = document.createElement("li");
    const labelElement = document.createElement("label");
    labelElement.setAttribute("for", presetId);
    labelElement.innerText = `Preset: ${preset.getName()}`;
    const checkboxElement = document.createElement("input");
    checkboxElement.type = "checkbox";
    checkboxElement.id = presetId;
    checkboxElement.checked = preset.getStatus();
    checkboxElement.addEventListener("change", async (e) => {
      await handlePresetInput(e, preset);
      await loadPresetList();
    });

    wrapperElement.appendChild(labelElement);
    wrapperElement.appendChild(checkboxElement);

    listElement.appendChild(wrapperElement);
  });
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const formElement = e.target;
  const formData = new FormData(formElement);
  const url = formData.get("url");

  if (!isUrl(url)) return;

  const repoUserBlockList = await BlockListRepository.getBlockList("_user");

  if (!repoUserBlockList) return;

  await repoUserBlockList.addUrl(url);
  await BlockListRepository.saveBlockList(repoUserBlockList);

  formElement.reset();

  await loadList();
}

async function initalize() {
  const shortsInput = document.getElementById("shortsInput");
  if (shortsInput) shortsInput.addEventListener("click", handleShortsInput);
  await loadShortsInputValue();

  const formElement = document.getElementById("addForm");
  if (formElement) formElement.addEventListener("submit", handleFormSubmit);
  await loadList();

  await loadPresetList();
}

window.addEventListener("DOMContentLoaded", initalize);
