import { Schema, model, models } from "mongoose";

/* ======================== SWIPE SCHEMA ======================== */
const SwipeSchema = new Schema(
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
    action: { 
      type: String, 
      enum: ["right", "left"], 
      required: true 
    },
    swipedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/* ======================== INDEXES ======================== */
SwipeSchema.index({ jobId: 1, userId: 1 }, { unique: true });
SwipeSchema.index({ userId: 1, createdAt: -1 });

/* ======================== MODEL ======================== */
const Swipe = models.Swipe || model("Swipe", SwipeSchema);
export default Swipe;
