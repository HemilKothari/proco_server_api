import { Schema, model, models } from "mongoose";
import { JobDocument } from "../types";


/* ======================== JOB SCHEMA ======================== */
const JobSchema = new Schema<JobDocument>(
  {
    title: { type: String, required: true },
    pincode: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
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
      default: "",
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
    domain: {
      type: String,
      default: "",
    },
    opportunityType: {
      type: String,
      enum: ["Internship", "Research", "Freelance", "Competition", "Collaborate", ""],
      default: "",
    },
    city: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

/* ======================== MODEL EXPORT ======================== */
const Job =
  models.Job || model<JobDocument>("Job", JobSchema);

export default Job;
