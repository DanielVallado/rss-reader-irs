function ExtractImageUrl(item: any): string | undefined {
  // Extract image from mediaThumbnail
  if (item.mediaThumbnail?.[0]?.$?.url) {
    return item.mediaThumbnail[0].$.url;
  }
  
  // Extract image from mediaContent
  if (item.mediaContent?.[0]) {
    const mediaItem = item.mediaContent[0];
    if (mediaItem["media:thumbnail"]?.[0]?.$?.url) {
      return mediaItem["media:thumbnail"][0].$.url;
    }

    if (mediaItem.$?.url && (!mediaItem.$.type || !mediaItem.$.type.includes("video"))) {
      return mediaItem.$.url;
    }
  }

  // Extract image from mediaGroup
  if (item.mediaGroup?.[0]) {
    const group = item.mediaGroup[0];
    if (group["media:content"] && Array.isArray(group["media:content"]) && group["media:content"].length > 0) {
      return group["media:content"][0].$?.url;
    }
  }

  // Extract image from enclosure
  if (item.enclosure) {
    if (typeof item.enclosure === "string") {
      return item.enclosure.trim();
    }
    if (item.enclosure.url) {
      return item.enclosure.url;
    }
    if (item.enclosure._) {
      return item.enclosure._.trim();
    }
  }

  return findImageUrlInObject(item);
}

function findImageUrlInObject(obj: any): string | undefined {
  if (typeof obj === "string") {
    if (obj.includes("<img")) {
      const src = extractSrcFromImgTag(obj);
      if (src) return src;
    }

    const lower = obj.toLowerCase();
    if (
      lower.includes(".jpg") ||
      lower.includes(".jpeg") ||
      lower.includes(".png") ||
      lower.includes(".gif")
    ) {
      return obj.trim();
    }
  } else if (Array.isArray(obj)) {
    for (const el of obj) {
      const result = findImageUrlInObject(el);
      if (result) return result;
    }
  } else if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const result = findImageUrlInObject(obj[key]);
        if (result) return result;
      }
    }
  }
  return undefined;
}

function extractSrcFromImgTag(html: string): string | undefined {
  const match = html.match(/<img\s+[^>]*src=["']([^"']+)["']/i);
  return match ? match[1] : undefined;
}


export default ExtractImageUrl;