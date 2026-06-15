import { getLocalValue, hasLocalValue, setLocalValue } from "./storage.js";

export class BlockShorts {
  static _instance = null;

  static async getInstance() {
    if (BlockShorts._instance) return BlockShorts._instance;

    if (!(await hasLocalValue("blockShorts"))) {
      await setLocalValue("blockShorts", JSON.stringify(false));
    }

    BlockShorts._instance = new BlockShorts();
    return BlockShorts._instance;
  }

  async getValue() {
    const value = await getLocalValue("blockShorts");
    return JSON.parse(value);
  }

  async setValue(value) {
    if (typeof value !== "boolean")
      throw new Error("value must be type of boolean");

    await setLocalValue("blockShorts", JSON.stringify(value));
  }

  async registerScript() {
    chrome.scripting
      .registerContentScripts([
        {
          id: "shorts-script",
          css: ["content/shorts.css"],
          matches: ["*://*.youtube.com/*"],
          runAt: "document_end",
        },
      ])
      .then(() => console.log("[shorts-script] registration complete"))
      .catch((err) => console.warn("unexpected error", err));
  }

  async hasRegisteredScript() {
    const scripts = await chrome.scripting.getRegisteredContentScripts();
    if (scripts.length === 0) return false;
    return scripts.some((script) => script.id === "shorts-script");
  }

  async unregisterScript() {
    if (!(await this.hasRegisteredScript())) return;
    chrome.scripting
      .unregisterContentScripts({ ids: ["shorts-script"] })
      .then(() => console.log("[shorts-script] un-registration complete"))
      .catch((err) => console.warn("unexpected error", err));
  }
}
