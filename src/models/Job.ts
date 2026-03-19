import { Schema, model, models } from "mongoose";
import { JobDocument } from "../types";


/* ======================== JOB SCHEMA ======================== */
const JobSchema = new Schema<JobDocument>(
  {
    title: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    company: { type: String },
    description: { type: String },
    salary: { type: String },
    period: { type: String },
    hiring: { type: Boolean, required: true, default: false },
    contract: { type: String },
    requirements: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      required: true,
    },
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    swipedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    matchedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

/* ======================== MODEL EXPORT ======================== */
const Job =
  models.Job || model<JobDocument>("Job", JobSchema);

export default Job;
