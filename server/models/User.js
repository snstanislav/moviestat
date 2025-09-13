
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { evaluationSchema } = require("./Evaluation")

const userSchema = new mongoose.Schema({
    email: { type: String, required: false },
    login: { type: String, required: true },
    password: { type: String, required: true },
    fullName: String,
    role: String,
    evals: [evaluationSchema]
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

module.exports.userSchema = userSchema;
module.exports.User = mongoose.model("User", userSchema, "users");