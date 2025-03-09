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

  return undefined;
}

export default ExtractImageUrl;