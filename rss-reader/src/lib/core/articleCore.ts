import type { ArticleWithCategories } from "$lib/server/services";


export function sortArticles(articles: ArticleWithCategories[], criterion: "date" | "title" | "description" | "category"): ArticleWithCategories[] {
  const arr = [...articles];

  switch (criterion) {
    case "title":
      arr.sort((a, b) => {
        const A = a.title?.toLowerCase() ?? "";
        const B = b.title?.toLowerCase() ?? "";
        if (!A && B) return 1;
        if (A && !B) return -1;
        return A.localeCompare(B);
      });
      break;

    case "description":
      arr.sort((a, b) => {
        const A = a.description?.toLowerCase() ?? "";
        const B = b.description?.toLowerCase() ?? "";
        if (!A && B) return 1;
        if (A && !B) return -1;
        return A.localeCompare(B);
      });
      break;

    case "category":
      arr.sort((a, b) => {
        const A = a.categories && a.categories.length > 0 ? a.categories[0].toLowerCase() : "";
        const B = b.categories && b.categories.length > 0 ? b.categories[0].toLowerCase() : "";
        if (!A && B) return 1;
        if (A && !B) return -1;
        return A.localeCompare(B);
      });
      break;

    case "date":
    default:
      arr.sort((a, b) => {
        const tA = a.publishedAt
          ? new Date(a.publishedAt).getTime()
          : -Infinity;
        const tB = b.publishedAt
          ? new Date(b.publishedAt).getTime()
          : -Infinity;
        return tB - tA;
      });
  }
  return arr;
}

export type SortCriterion = "date" | "title" | "description" | "category";