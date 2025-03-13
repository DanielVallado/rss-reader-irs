import Parser from "rss-parser";
import { IsValidUrl } from "$lib";
import { createRss } from "$lib/server/repositories/rssRepository";
import type { NewRss } from "$lib/server/repositories/rssRepository";

import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export async function load({ url }) {
  const rssLink = url.searchParams.get("rss") || "http://www.smh.com.au/rssheadlines/world/article/rss.xml";

  const parser = new Parser({
    customFields: {
      item: [
        ["media:thumbnail", "mediaThumbnail", { keepArray: true }],
        ["media:content", "mediaContent", { keepArray: true }],
        ["media:group", "mediaGroup", { keepArray: true }],
      ],
    },
  });

  try {
    const feed = await parser.parseURL(rssLink);
    const safeFeed = JSON.parse(JSON.stringify(feed));
    return { feed: safeFeed };
  } catch (error) {
    if (error instanceof Error) {
      return { feed: null, error: error.message };
    } else {
      return { feed: null, error: "Ocurrió un error desconocido" };
    }
  }
}

export const actions = {
  default: async ({ request }) => {    
    const formData = await request.formData();
    const urlValue = formData.get("link");    

    if (!IsValidUrl(urlValue)) {
      return fail(400, {error: "La URL no es válida"});
    }

    const newRss: NewRss = { url: urlValue.trim() };    
    await createRss(newRss);
    return { success: true };
  },
} satisfies Actions;

