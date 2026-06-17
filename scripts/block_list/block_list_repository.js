import { getAllKeys, getLocalValue, setLocalValue } from "../storage.js";
import { BlockList } from "./block_list.js";

export class BlockListRepository {
  static _prefix = "restart-block-list-";

  static isValidBlockList(blockList) {
    return blockList instanceof BlockList;
  }

  static async saveBlockList(blockList) {
    console.log("blockList", blockList);
    if (!this.isValidBlockList(blockList))
      throw new Error(
        "[BlockListRepository.saveBlockList] argument blockList is not a valid BlockList",
      );

    const nameWithPrefix = this._prefix + blockList.getName();

    await setLocalValue(nameWithPrefix, JSON.stringify(blockList.getUrls()));
  }

  static async getBlockList(name) {
    const hasPrefix = name.startsWith(this._prefix);
    const nameWithPrefix = hasPrefix ? name : this._prefix + name;

    const repoBlockListUrlString = await getLocalValue(nameWithPrefix);

    if (!repoBlockListUrlString) return undefined;

    const repoBlockListUrlArray = JSON.parse(repoBlockListUrlString);

    try {
      const blockList = new BlockList(name, repoBlockListUrlArray);
      return blockList;
    } catch (err) {
      console.error("Error, [BlockListRepository.getBlockList]", err);
      return undefined;
    }
  }

  static async getAllLists() {
    const keys = await getAllKeys();
    const blockListArray = [];

    const filteredKeys = keys.filter((key) => key.startsWith(this._prefix));

    for (let i = 0; i < filteredKeys.length; i++) {
      const key = filteredKeys[i];
      const name = key.replace(this._prefix, "");
      const blockList = await this.getBlockList(name);
      if (blockList) blockListArray.push(blockList);
    }

    return blockListArray;
  }
}
