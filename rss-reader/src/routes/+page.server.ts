import { IsValidUrl } from "$lib";
import { parseRss, verifyRss } from "$lib/server/services";
import { getAllRss, createRss } from "$lib/server/repositories/rssRepository";
import type { NewRss } from "$lib/server/repositories/rssRepository";

import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export async function load() {
  // console.log(await getAllRss());
  
  const rssLink = [
    "http://rss.cnn.com/rss/edition_world.rss",
    "http://www.smh.com.au/rssheadlines/world/article/rss.xml",
  ];

  try {
    const feed = await parseRss(rssLink);
    return { feed: feed };
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
    
    if (await verifyRss(urlValue) === null) {
      return fail(400, {error: "La URL no es un feed RSS válido"});
    }

    const newRss: NewRss = { url: urlValue.trim() };    
    await createRss(newRss);
    return { success: true };
  },
} satisfies Actions;

