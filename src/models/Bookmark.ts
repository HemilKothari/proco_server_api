import { Schema, model, models } from "mongoose";

/* ======================== BOOKMARK SCHEMA ======================== */
const BookmarkSchema = new Schema(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId, // FIXED: was String, should be ObjectId
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

/* ======================== MODEL ======================== */
const Bookmark =
  models.Bookmark || model("Bookmark", BookmarkSchema);

export default Bookmark;
