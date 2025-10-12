class SearchItem {
    constructor(data = {}) {
        this.tmdbID = data.tmdbID || "";
        this.title = data.title || "";
        this.type = data.type || "";
        this.year = data.year || "";
        this.poster = data.poster || "";
        this.overview = data.overview || "";
    }
}
module.exports = SearchItem;