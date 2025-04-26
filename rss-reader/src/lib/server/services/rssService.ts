import Parser from "rss-parser";
import { isValidUrl } from "$lib";
import * as repository from "$lib/server/repositories";
import { error } from "@sveltejs/kit";

import type { NewRss } from "$lib/server/repositories";


const parser = new Parser({
  customFields: {
    item: [
      ["media:thumbnail", "mediaThumbnail", { keepArray: true }],
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:group", "mediaGroup", { keepArray: true }],
    ],
  },
});

export async function getAllRss(): Promise<any[]> {
  return await repository.getAllRss();
}

export async function saveRss(urlValue: unknown) {
  if (!isValidUrl(urlValue)) {
    throw error(400, "La URL no es válida");
  }

  if ((await verifyRss(urlValue)) === null) {
    throw error(400, "La URL no es un feed RSS válido");
  }

  const newRss: NewRss = { url: urlValue.trim() };
  await repository.createRss(newRss);
}

export async function verifyRss(rssLink: string): Promise<any> {
  try {
    return await parser.parseURL(rssLink);
  } catch (error) {
    return null;
  }
}

export async function parseRss(rssLink: string | string[]) {
  if (typeof rssLink === "string") {
    return await verifyRss(rssLink);
  } else {
    const feeds = await Promise.all(rssLink.map((link) => verifyRss(link)));
    return feeds.filter((feed) => feed && feed.items && feed.items.length > 0);
  }
}