import { saveRss, createArticle, getAllArticles, getAllRss, countArticles } from "$lib/server/services";
import { fail } from "@sveltejs/kit";

import type { Actions } from "./$types";


export async function load({ url }) {
  const limit  = Number(url.searchParams.get('limit') ?? 20);
  const page   = Number(url.searchParams.get('page')  ?? 1);
  const offset = (page - 1) * limit;

  const allArticles = await getAllArticles();

  const total = await countArticles();
  const pageCount = Math.ceil(total / limit);

  try {
    return { feed: allArticles, limit: limit, page: page};
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

    try {
      await saveRss(urlValue);
      return { success: true };
    } catch (err) {      
      return fail(500, { error: "No pude guardar el RSS, inténtalo de nuevo" });
    }  
  },
  reload: async () => {
    const allRss = await getAllRss();
    await createArticle(allRss); 

    try {
      return { success: true };
    } catch (err) {
      return fail(500, { error: "No pude guardar el RSS, inténtalo de nuevo" });
    }
  }
} satisfies Actions;

