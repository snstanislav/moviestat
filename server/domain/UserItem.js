class UserItem {
    constructor() {
        this._id = undefined;
        this.email = "";
        this.login = "";
        this.password = "";
        this.fullName = "";
        this.role = "";
        this.evals = [];
    }
}
module.exports.UserItem = UserItem;