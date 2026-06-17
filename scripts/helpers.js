export function isUrl(url) {
  if (typeof url !== "string")
    throw new Error("[isUrl] argument url must be type of string");

  const expression =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  const regex = new RegExp(expression);

  if (url.match(regex)) return true;
  return false;
}

export function isAllLowercase(value) {
  if (typeof value !== "string")
    throw new Error("[isAllLowercase] argument must be type of string");

  return value === value.toLowerCase();
}

export function hasWhitespace(value) {
  if (typeof value !== "string")
    throw new Error("[hasWhitespace] argument must be type of string");

  return !(value === value.replaceAll(" "));
}
