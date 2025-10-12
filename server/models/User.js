
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { evaluationSchema } = require("./Evaluation")

const userSchema = new mongoose.Schema({
    email: { type: String, required: false, unique: true },
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    evals: [evaluationSchema]
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
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