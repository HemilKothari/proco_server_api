const mongoose = require("mongoose");

const SwipeSchema = new mongoose.Schema(
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
    swipedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate swipes by the same user on the same job
SwipeSchema.index({ jobId: 1, userId: 1 }, { unique: true });

export  mongoose.model("Swipe", SwipeSchema);
