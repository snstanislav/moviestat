class MovieItem {
    constructor(data = {}) {
        // common id/type props
        this._id = data._id || undefined;
        this.type = data.type || "";
        this.tmdbID = data.tmdbID || "";
        // imdb props
        this.imdbID = data.imdbID || "";
        this.imdbRating = data.imdbRating || "";
        this.imdbVotes = data.imdbVotes || "";
        // general props
        this.commTitle = data.commTitle || "";
        this.origTitle = data.origTitle || "";
        this.year = data.year || "";
        this.duration = data.duration || "";
        this.parental = data.parental || "";
        this.plot = data.plot || "";
        this.poster = data.poster || "";
        this.budget = data.budget || "";
        this.boxOffice = data.boxOffice || "";
        // multiple common props
        this.countries = data.countries || [];
        this.languages = data.languages || [];
        this.genres = data.genres || [];
        // multiple crew props
        this.directors = data.directors || [];
        this.writers = data.writers || [];
        this.producers = data.producers || [];
        this.composers = data.composers || [];
        this.cast = data.cast || [];
        // moviestat props
        this.userRating = data.userRating || 0;
        this.userEvalDate = data.userEvalDate || "";
        this.userChangeEvalDate = data.userChangeEvalDate || "";
        this.isFavorite = data.isFavorite || false;
    }
}
module.exports = MovieItem;