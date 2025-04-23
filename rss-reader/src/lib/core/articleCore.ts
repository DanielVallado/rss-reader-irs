import type { Article } from "$lib/server/repositories";


export function sortArticles(articles: Article[], criterion: "date" | "title" | "description"): Article[] {
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

export type SortCriterion = "date" | "title" | "description";