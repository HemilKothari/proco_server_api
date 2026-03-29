import mongoose, { Schema, Model } from "mongoose";
import {Image } from "../types";

// ======================== IMAGE SCHEMA ========================
const imageSchema = new Schema<Image>(
  {
    image: {
      type: Buffer,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ======================== IMAGE MODEL ========================
const Image: Model<Image> = mongoose.model<Image>("Image", imageSchema);

export default Image;