import { getLocalValue, hasLocalValue, setLocalValue } from "./storage.js";

export class BlockList {
  static _instance = null;

  static async getInstance() {
    if (BlockList._instance) return BlockList._instance;

    if (!(await hasLocalValue("blockList"))) {
      await setLocalValue("blockList", JSON.stringify([]));
    }

    BlockList._instance = new BlockList();
    return BlockList._instance;
  }

  async getUrls() {
    const result = await getLocalValue("blockList");
    return JSON.parse(result);
  }

  async addUrl(url) {
    if (typeof url !== "string") throw new Error("url must be type of string");

    const currentList = await this.getUrls();
    currentList.push(url);
    setLocalValue("blockList", JSON.stringify(currentList));
  }

  async removeAtIndex(index) {
    if (isNaN(index)) throw new Error("index must be type of number");

    const currentList = await this.getUrls();
    if (!currentList[index]) return;

    currentList.splice(index, 1);

    setLocalValue("blockList", JSON.stringify(currentList));
  }
}
