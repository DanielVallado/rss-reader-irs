import { saveRss, saveArticles } from "$lib/server/services";
import { getAllRss, getAllArticles } from "$lib/server/repositories";

import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export async function load() {
  const allArticles = await getAllArticles();
  const sortedArticles = allArticles.sort((a, b) => {
    const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return timeB - timeA;
  });

  try {
    return { feed: sortedArticles };
  } catch (error) {
    if (error instanceof Error) {
      return { feed: null, error: error.message };
    } else {
      return { feed: null, error: "Ocurrió un error desconocido" };
    }
  }
}

export const actions = {
  addRss: async ({ request }) => {    
    const formData = await request.formData();
    const urlValue = formData.get("link");    
    saveRss(urlValue);
    
    return { success: true };
  },
  reload: async () => {
    const allRss = await getAllRss();
    saveArticles(allRss);

    return { success: true };
  }
} satisfies Actions;

