export function prettyMediaType(rawMediaType) {
    var result = "";
    switch (rawMediaType) {
        case "movie":
            result = "Movie";
            break;
        case "tv":
            result = "TV Series";
            break;
        default:
            result = "";
            break;
    }
    return result;
}