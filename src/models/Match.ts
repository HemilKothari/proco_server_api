const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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

// Prevent duplicate matches for same job-user combo
MatchSchema.index({ jobId: 1, userId: 1 }, { unique: true });

export  mongoose.model("Match", MatchSchema);
