export function optimizeImage(src: string, width: number = 400, height: number = 200, output: string = "webp", dpr: number = 1): string {
    if (!src) return "";

    const fit = "cover";
    const quality = 90;

    const cleanUrl = src.replace(/^https?:\/\//, "");

    if (!/^https?:\/\//.test(src)) {
      return src;
    }

    const params = new URLSearchParams({
        url: cleanUrl,
        w: width.toString(),
        h: height.toString(),
        fit,
        output,
        q: quality.toString(),
        dpr: dpr.toString(),
    });

    return `https://images.weserv.nl/?${params.toString()}`;
}

export default optimizeImage;
