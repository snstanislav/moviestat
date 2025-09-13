class EvaluationItem {
    constructor(movie, userRating, userEvalDate, userChangeEvalDate, isFavorite){
        this.movie = movie;
        this.userRating = userRating;
        this.userEvalDate = userEvalDate;
        this.userChangeEvalDate = userChangeEvalDate;
        this.isFavorite = isFavorite;
    }
}
module.exports.EvaluationItem = EvaluationItem;