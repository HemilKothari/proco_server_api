import express, { Application } from "express";
import bodyParser from "body-parser";
import mongoose, { Schema, Model } from "mongoose";

// ======================== EXPRESS APP ========================
const app: Application = express();

app.use(
  bodyParser.json({
    limit: "10mb", // For parsing large Base64 strings
  })
);

// ======================== IMAGE TYPES ========================
export interface Image {
  image: Buffer;
}

export type ImageDocument = mongoose.HydratedDocument<Image>;

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