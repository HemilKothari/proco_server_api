const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        location: { type: String, required: false, default: "India"},
        phone: { type: String, required: false , default:"1234567890"},
        isAdmin: {
            type: Boolean,
            default: true
        },
        isAgent: {
            type: Boolean,
            default: true
        },
        skills: {
            type: Array,
            required: false,
            default:["skill 01", "skill 02", "skill 03", "skill 04", "skill 05"]
        },
        profile: {
            type: String,
            require: true,
            default: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-Clip-Art-Transparent-PNG.png"
        },

    }, { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema)