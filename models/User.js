const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    phone: { type: String, required: false, default: "1234567890" },
    isAdmin: { type: Boolean, default: true },
    isAgent: { type: Boolean, default: true },
    skills: {
      type: Array,
      required: false,
      default: ["skill 01", "skill 02", "skill 03", "skill 04", "skill 05"],
    },
    profile: {
      type: String,
      required: true,
      default:
        "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-Clip-Art-Transparent-PNG.png",
    },
    college: { type: String, required: false },
    gender: { type: String, required: false },
    branch: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    country: { type: String, required: false },
    isFirstTimeUser: { type: Boolean, default: true }, // Track if user has completed profile
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
