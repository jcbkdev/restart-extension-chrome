import { hasWhitespace, isAllLowercase } from "../helpers.js";
import { setLocalValue } from "../storage.js";

export class Preset {
  _name;
  _urls;
  _status;

  constructor(name, urls, status = false) {
    if (typeof name !== "string")
      throw new Error(
        "[Preset.constructor] argument name must be type of string",
      );

    if (name.length === 0)
      throw new Error("[Preset.constructor] argument name must NOT be empty");

    if (hasWhitespace(name))
      throw new Error(
        "[Preset.constructor] argument name must NOT have white spaces",
      );

    if (!isAllLowercase(name))
      throw new Error(
        "[Preset.constructor] argument name must be ALL lower-case",
      );

    if (!Array.isArray(urls))
      throw new Error("[Preset.constructor] argument urls must be an array");

    if (typeof status !== "boolean")
      throw new Error(
        "[Preset.constructor] argument status must be type of boolean",
      );

    this._name = name;
    this._urls = urls;
    this._status = status;
  }

  toJSON() {
    const presetData = {
      status: this._status,
      urls: this._urls,
    };

    return presetData;
  }

  getName() {
    return this._name;
  }

  getUrls() {
    return this._urls;
  }

  getStatus() {
    return this._status;
  }

  setStatus(status) {
    if (typeof status !== "boolean")
      throw new Error(
        "[Preset.setStatus] argument status must be type of boolean",
      );

    this._status = status;
  }
}
