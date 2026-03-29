import { Schema, model, models } from "mongoose";

/* ======================== USER SCHEMA ======================== */
const UserSchema = new Schema (
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "1234567890",
    },

    isAdmin: {
      type: Boolean,
      default: true,
    },

    isAgent: {
      type: Boolean,
      default: true,
    },

    skills: {
      type: [String], // FIXED: Array → string[]
      default: [],
    },

    profile: {
      type: String,
      required: true,
      default:
        "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-Clip-Art-Transparent-PNG.png",
    },

    college: { type: String },
    gender: { type: String },
    branch: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    age: { type: String, default: '' },
    linkedInUrl: { type: String, default: '' },
    gitHubUrl: { type: String, default: '' },
    twitterUrl: { type: String, default: '' },
    portfolioUrl: { type: String, default: '' },
    interests: { type: [String], default: [] },
    hobbies: { type: [String], default: [] },

    isFirstTimeUser: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* ======================== MODEL ======================== */
const User = models.User || model("User", UserSchema);
export default User;
