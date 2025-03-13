import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: [
      ["media:thumbnail", "mediaThumbnail", { keepArray: true }],
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:group", "mediaGroup", { keepArray: true }],
    ],
  },
});

export async function verifyRss(rssLink: string): Promise<any> {
  try {
    return await parser.parseURL(rssLink);
  } catch (error) {
    return null;
  }
}

export async function parseRss(rssLinks: string[]): Promise<any[]> {
  const feeds = await Promise.all(rssLinks.map(link => verifyRss(link)));
  return feeds.filter(feed => feed && feed.items && feed.items.length > 0);
}
