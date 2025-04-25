import { saveRss, saveArticles, getAllArticles, getAllRss } from "$lib/server/services";
import { fail } from "@sveltejs/kit";

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
    await saveArticles(allRss); 

    try {
      return { success: true };
    } catch (err) {
      return fail(500, { error: "No pude guardar el RSS, inténtalo de nuevo" });
    }
  }
} satisfies Actions;

