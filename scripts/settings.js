import { BlockList } from "./block_list/block_list.js";
import { BlockListRepository } from "./block_list/block_list_repository.js";
import { BlockShorts } from "./block_shorts.js";
import { isUrl } from "./helpers.js";

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
}

window.addEventListener("DOMContentLoaded", initalize);
