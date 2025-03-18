import sanitizeHtml from "sanitize-html";

function SanitizeText(text: string): string {
  let sanitized = sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  });
  sanitized = sanitized.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "");
  return sanitized.replace(/\s+/g, ' ').trim();
}

export function SanitizeArticle(article: any): any {
  const sanitizedArticle = { ...article };

  if (typeof sanitizedArticle.title === "string") {
    sanitizedArticle.title = SanitizeText(sanitizedArticle.title);
  }
  if (typeof sanitizedArticle.link === "string") {
    sanitizedArticle.link = SanitizeText(sanitizedArticle.link);
  }
  if (typeof sanitizedArticle.pubDate === "string") {
    sanitizedArticle.pubDate = SanitizeText(sanitizedArticle.pubDate);
  }
  if (typeof sanitizedArticle.description === "string") {
    sanitizedArticle.description = SanitizeText(sanitizedArticle.description);
  }
  if (typeof sanitizedArticle.content === "string") {
    sanitizedArticle.content = SanitizeText(sanitizedArticle.content);
  }
  if (typeof sanitizedArticle.creator === "string") {
    sanitizedArticle.creator = SanitizeText(sanitizedArticle.creator);
  }

  return sanitizedArticle;
}

export default SanitizeArticle;