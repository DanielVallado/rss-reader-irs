export function optimizeImage(src: string, width: number = 400, height: number = 200, output: string = "webp", quality: number = 90, dpr: number = 1): string {
    if (!src) return "";

    const fit = "cover";

    const cleanUrl = src.replace(/^https?:\/\//, "").replace(/^\/\//, ""); ;

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

    return `https://images.weserv.nl/?${params.toString()}&tao=1`;
}

export default optimizeImage;
