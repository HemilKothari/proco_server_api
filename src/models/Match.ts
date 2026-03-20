import { Schema, model, models } from "mongoose";

/* ======================== MATCH SCHEMA ======================== */
const MatchSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/* ======================== INDEXES ======================== */
MatchSchema.index({ jobId: 1, userId: 1 }, { unique: true });

/* ======================== MODEL ======================== */
const Match = models.Match || model("Match", MatchSchema);
export default Match;
