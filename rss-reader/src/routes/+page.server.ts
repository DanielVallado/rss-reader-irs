import Parser from "rss-parser";

export async function load({ url }) {
  const rssLink =
    url.searchParams.get("rss") || "http://rss.cnn.com/rss/cnn_world.rss";

    
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
    return { feed };
  } catch (error) {
    if (error instanceof Error) {
      return { feed: null, error: error.message };
    } else {
      return { feed: null, error: "Ocurrió un error desconocido" };
    }
  }

}
