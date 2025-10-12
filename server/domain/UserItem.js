class UserItem {
    constructor(data = {}) {
        this._id = data._id || undefined;
        this.email = data.email || "";
        this.login = data.login || "";
        this.password = data.password || "";
        this.fullName = data.fullName || "";
        this.role = data.role || "user";
        this.evals = data.evals || [];
    }
}
module.exports = UserItem;