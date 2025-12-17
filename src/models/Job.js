const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    location: { type: String, required: true, unique: false },
    company: { type: String, required: false },
    description: { type: String, required: false },
    salary: { type: String, required: false },
    period: { type: String, required: false },
    hiring: { type: Boolean, required: true, default: false },
    contract: { type: String, required: false },
    requirements: {
      type: Array,
      required: false,
    },
    imageUrl: {
      type: String,
      require: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    swipedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
      },
    ],
    matchedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Job", JobSchema);
