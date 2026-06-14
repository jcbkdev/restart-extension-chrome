import { BlockList } from "./block_list.js";
import { isUrl } from "./helpers.js";

function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

async function loadList() {
  const listElement = document.getElementById("list");
  const blockListInstance = await BlockList.getInstance();
  const blockList = await blockListInstance.getUrls();

  removeAllChildren(listElement);

  blockList.forEach((url, index) => {
    const urlElement = document.createElement("ul");
    const removeButton = document.createElement("button");
    removeButton.innerText = "remove";
    removeButton.addEventListener("click", async () => {
      await blockListInstance.removeAtIndex(index);
      loadList();
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

  const blockListInstance = await BlockList.getInstance();
  const blockList = await blockListInstance.addUrl(url);

  formElement.reset();

  await loadList();
}

async function initalize() {
  const formElement = document.getElementById("addForm");
  if (formElement) formElement.addEventListener("submit", handleFormSubmit);
  await loadList();
}

window.addEventListener("DOMContentLoaded", initalize);
