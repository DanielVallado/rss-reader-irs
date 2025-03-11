function IsValidUrl(url: any): url is string {
    if (typeof url !== "string" || url.trim() === "" || url === null) return false;

    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

export default IsValidUrl;