class MovieEntry {
  constructor() {
    this.imdbId = ""
    this.imdbLink = ""
    this.commTitle = ""
    this.origTitle = ""
    this.year = ""
    this.duration = ""
    this.parental = ""
    this.type = ""
    this.countriesOrig = []
    this.plot = ""
    this.imdbRating = ""
    this.imdbRatingNum = ""
    this.sPoster = ""
    this.genres = []
    this.director = []
    this.cast = []
    this.budget = ""
    this.grossWW = ""
    this.pRating = 0
    this.pDateTime = ""
    this.favorite = ""
  }

  copy(item) {
    if (item) {
      this.imdbId = item.imdbId
      this.imdbLink = item.imdbLink
      this.commTitle = item.commTitle
      this.origTitle = item.origTitle
      this.year = item.year
      this.duration = item.duration
      this.parental = item.parental
      this.type = item.type
      this.countriesOrig = item.countriesOrig
      this.plot = item.plot
      this.imdbRating = item.imdbRating
      this.imdbRatingNum = item.imdbRatingNum
      this.sPoster = item.sPoster
      this.genres = item.genres
      this.director = item.director
      this.cast = item.cast
      this.budget = item.budget
      this.grossWW = item.grossWW
      this.pRating = item.pRating
      this.pDateTime = item.pDateTime
      this.favorite = item.favorite
    } else {
      console.error("Invalid object value to copy")
    }
  }
}
module.exports.MovieEntry = MovieEntry;