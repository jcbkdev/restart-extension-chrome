import { hasWhitespace, isAllLowercase } from "../helpers.js";
import { getLocalValue, hasLocalValue, setLocalValue } from "../storage.js";

export class BlockList {
  _name;
  _urls;

  constructor(name, urls = []) {
    if (typeof name !== "string")
      throw new Error(
        "[BlockList.constructor] argument name must be type of string",
      );
    if (name.length === 0)
      throw new Error(
        "[BlockList.constructor] argument name must NOT be empty",
      );
    if (hasWhitespace(name))
      throw new Error(
        "[BlockList.constructor] argument name must NOT have white spaces",
      );
    if (!isAllLowercase(name))
      throw new Error(
        "[BlockList.constructor] argument name must be ALL lower-case",
      );

    if (!Array.isArray(urls))
      throw new Error("[BlockList.constructor] argument urls must be an array");

    this._name = name;
    this._urls = urls;
  }

  getName() {
    return this._name;
  }

  getUrls() {
    return this._urls;
  }

  addUrl(url) {
    if (typeof url !== "string")
      throw new Error("[BlockList.addUrl] argument url must be type of string");

    this._urls.push(url);
  }

  removeAtIndex(index) {
    if (isNaN(index))
      throw new Error(
        "[BlockList.removeAtIndex] argument index must be type of number",
      );

    if (!this._urls[index]) return;

    this._urls.splice(index, 1);
  }
}
