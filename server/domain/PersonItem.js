class PersonItem {
    constructor(data = {}) {
        this._id = data._id || undefined;
        this.tmdbID = data.tmdbID || "";
        this.imdbID = data.imdbID || "";
        this.name = data.name || "";
        this.birthday = data.birthday || "";
        this.placeOfBirth = data.placeOfBirth || "";
        this.gender = data.gender || -1;
        this.photo = data.photo || "";
        this.biography = data.biography || "";
    }
}
module.exports = PersonItem;