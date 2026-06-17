import { Preset } from "./preset.js";
import { PresetRepository } from "./preset_repository.js";

const aiPreset = new Preset(
  "ai",
  [
    "chatgpt.com",
    "claude.ai",
    "perplexity.ai",
    "gemini.google.com",
    "copilot.microsoft.com",
    "poe.com",
    "meta.ai",
    "character.ai",
    "huggingface.co",
    "midjourney.com",
    "civitai.com",
    "grok.com",
  ],
  false,
);

const shoppingPreset = new Preset(
  "shopping",
  [
    "amazon.com",
    "ebay.com",
    "aliexpress.com",
    "etsy.com",
    "walmart.com",
    "target.com",
    "shein.com",
    "temu.com",
    "bestbuy.com",
    "wayfair.com",
    "asos.com",
  ],
  false,
);

const socialPreset = new Preset(
  "social",
  [
    "youtube.com",
    "twitch.tv",
    "reddit.com",
    "twitter.com",
    "x.com",
    "instagram.com",
    "facebook.com",
    "tiktok.com",
    "tumblr.com",
    "kick.com",
  ],
  false,
);

const streamingPreset = new Preset(
  "streaming",
  [
    "netflix.com",
    "hulu.com",
    "disneyplus.com",
    "max.com",
    "primevideo.com",
    "crunchyroll.com",
    "peacocktv.com",
    "paramountplus.com",
    "appletv.com",
    "tubitv.com",
  ],
  false,
);

const newsPreset = new Preset(
  "news",
  [
    "cnn.com",
    "foxnews.com",
    "bbc.com",
    "nytimes.com",
    "msnbc.com",
    "huffpost.com",
    "buzzfeed.com",
    "theguardian.com",
    "wsj.com",
    "npr.org",
    "washingtonpost.com",
    "cnbc.com",
  ],
  false,
);

const pornPreset = new Preset(
  "porn",
  [
    "pornhub.com",
    "xvideos.com",
    "xnxx.com",
    "xhamster.com",
    "redtube.com",
    "youporn.com",
    "spankbang.com",
    "eporner.com",
    "beeg.com",
    "chaturbate.com",
    "stripchat.com",
    "bongacams.com",
    "onlyfans.com",
    "fansly.com",
  ],
  false,
);

export const defaultPresets = {
  ai: aiPreset,
  news: newsPreset,
  shopping: shoppingPreset,
  social: socialPreset,
  streaming: streamingPreset,
  porn: pornPreset,
};
