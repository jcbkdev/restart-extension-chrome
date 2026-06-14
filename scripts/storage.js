export async function setLocalValue(key, value) {
  if (typeof key !== "string") throw new Error("key must be type of string");
  if (typeof value !== "string")
    throw new Error("value must be type of string");

  await chrome.storage.local.set({ [key]: value });
}

export async function getLocalValue(key) {
  if (typeof key !== "string") throw new Error("key must be type of string");

  const result = await chrome.storage.local.get([key]);
  return result[key];
}

export async function hasLocalValue(key) {
  if (typeof key !== "string") throw new Error("key must be type of string");

  const result = await getLocalValue(key);
  if (!result) return false;
  return true;
}
