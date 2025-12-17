const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
        },
        userId: { type: String, required: true, },

    }, { timestamps: true }
);
export  mongoose.model("Bookmark", BookSchema)