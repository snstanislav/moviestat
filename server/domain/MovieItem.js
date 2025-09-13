class MovieItem {
    constructor() {
        // common id/type props
        this._id = undefined;
        this.type = "";
        this.tmdbID = "";
        // imdb props
        this.imdbID = "";
        this.imdbRating = "";
        this.imdbVotes = "";
        // general props
        this.commTitle = "";
        this.origTitle = "";
        this.year = "";
        this.duration = "";
        this.parental = "";
        this.plot = "";
        this.poster = "";
        this.budget = "";
        this.boxOffice = "";
        // multiple common props
        this.countries = [];
        this.languages = [];
        this.genres = [];
        // multiple crew props
        this.directors = [];
        this.writers = [];
        this.producers = [];
        this.composers = [];
        this.cast = [];
        // moviestat props
        this.userRating = 0;
        this.userEvalDate = "";
        this.userChangeEvalDate = "";
        this.isFavorite = false;
    }
}
module.exports.MovieItem = MovieItem;