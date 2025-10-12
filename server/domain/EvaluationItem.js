class EvaluationItem {
    constructor(data = {}) {
        this.movie = data.movie;
        this.userRating = data.userRating;
        this.userEvalDate = data.userEvalDate;
        this.userChangeEvalDate = data.userChangeEvalDate;
        this.isFavorite = data.isFavorite;
    }
}
module.exports = EvaluationItem;