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

function initialize() {
  loadActivePresets();
}

initialize();
