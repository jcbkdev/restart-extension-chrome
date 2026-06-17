import { getAllKeys, getLocalValue, setLocalValue } from "../storage.js";
import { Preset } from "./preset.js";

export class PresetRepository {
  static _prefix = "restart-preset-";

  static isValidPreset(preset) {
    return preset instanceof Preset;
  }

  static isValidPresetData(presetData) {
    const hasUrlsProperty = Object.hasOwn(presetData, "urls");
    const hasStatusProperty = Object.hasOwn(presetData, "status");

    if (!hasUrlsProperty || !hasStatusProperty) return false;

    const isUrlsArray = Array.isArray(presetData.urls);
    const isStatusBoolean = typeof presetData.status === "boolean";

    if (!isUrlsArray || !isStatusBoolean) return false;
    return true;
  }

  static async savePreset(preset) {
    if (!this.isValidPreset(preset))
      throw new Error(
        "[PresetRepository.savePreset] argument preset is not a valid Preset",
      );

    const nameWithPrefix = this._prefix + preset.getName();

    await setLocalValue(nameWithPrefix, JSON.stringify(preset));
  }

  static async getPreset(name) {
    const hasPrefix = name.startsWith(this._prefix);
    const nameWithPrefix = hasPrefix ? name : this._prefix + name;

    const repoPresetDataString = await getLocalValue(nameWithPrefix);

    if (!repoPresetDataString) return undefined;

    const repoPresetData = JSON.parse(repoPresetDataString);

    if (!this.isValidPresetData(repoPresetData)) {
      console.error(
        `[PresetRepository.getPreset], invalid preset data - corrupted preset [name: ${name}]`,
      );
      return undefined;
    }

    try {
      const preset = new Preset(
        name,
        repoPresetData.urls,
        repoPresetData.status,
      );
      return preset;
    } catch (err) {
      console.error("Error, [PresetRepository.getPreset]", err);
      return undefined;
    }
  }

  static async getAllUrls(activeOnly = false) {
    if (typeof activeOnly !== "boolean")
      throw new Error(
        "[Preset.getAllUrls] argument activeOnly must be type of boolean",
      );

    const keys = await getAllKeys();
    const urlArray = [];

    const filteredKeys = keys.filter((key) => key.startsWith(this._prefix));

    for (let i = 0; i < filteredKeys.length; i++) {
      const key = filteredKeys[i];
      const name = key.replace(this._prefix, "");
      const preset = await this.getPreset(name);
      if (preset) {
        if (activeOnly === true && preset.getStatus() === false) continue;
        urlArray.push(...preset.getUrls());
      }
    }

    return urlArray;
  }

  static async getAllPresets(activeOnly = false) {
    if (typeof activeOnly !== "boolean")
      throw new Error(
        "[Preset.getAllPresets] argument activeOnly must be type of boolean",
      );

    const keys = await getAllKeys();
    const presetArray = [];

    const filteredKeys = keys.filter((key) => key.startsWith(this._prefix));

    for (let i = 0; i < filteredKeys.length; i++) {
      const key = filteredKeys[i];
      const name = key.replace(this._prefix, "");
      const preset = await this.getPreset(name);

      if (activeOnly && preset.getStatus() === false) continue;

      if (preset) presetArray.push(preset);
    }

    return presetArray;
  }
}
