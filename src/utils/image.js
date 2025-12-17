const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Initialize Express
const app = express();
app.use(bodyParser.json({ limit: "10mb" })); // For parsing large Base64 strings

// Define Image Schema
const imageSchema = new Schema({
  image: Buffer, // Store binary data
});
const Image = mongoose.model("Image", imageSchema);
