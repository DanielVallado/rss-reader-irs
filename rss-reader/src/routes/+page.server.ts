import { saveRss, saveArticles, getAllArticles, getAllRss } from "$lib/server/services";

import type { Actions } from "./$types";


export async function load() {
  const allArticles = await getAllArticles();

  try {
    return { feed: allArticles };
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

