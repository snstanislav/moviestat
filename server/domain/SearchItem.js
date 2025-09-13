class SearchItem {
    constructor(tmdbID, title, type, year, poster, overview) {
        this.tmdbID = tmdbID;
        this.title = title;
        this.type = type;
        this.year = year;
        this.poster = poster;
        this.overview = overview;
    }
}
module.exports.SearchItem = SearchItem;