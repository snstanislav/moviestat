class PersonItem {
    constructor() {
        this._id = undefined;
        this.tmdbID = "";
        this.imdbID = "";
        this.name = "";
        this.birthday = "";
        this.placeOfBirth = "";
        this.gender = "";
        this.photo = "";
        this.biography = "";
    }

    setInstance(tmdbID, imdbID, name, birthday, placeOfBirth, gender, photo, biography) {
        this._id = undefined;
        this.tmdbID = tmdbID;
        this.imdbID = imdbID;
        this.name = name;
        this.birthday = birthday;
        this.placeOfBirth = placeOfBirth;
        this.gender = gender;
        this.photo = photo;
        this.biography = biography;
        return this;
    }
}
module.exports.PersonItem = PersonItem;