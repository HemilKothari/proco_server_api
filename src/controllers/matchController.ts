const Match = require("../models/Match");

// ======================== ADD MATCH ========================
const addMatch = async (req, res) => {
  try {
    const { jobId, userId } = req.body;

    if (!jobId || !userId) {
      return res.status(400).json({ message: "jobId and userId are required" });
    }

    const newMatch = new Match({ jobId, userId });
    await newMatch.save();

    res
      .status(200)
      .json({ message: "User matched successfully", match: newMatch });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "User already matched for this job" });
    }
    console.error("Error adding match:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// ======================== GET MATCHES FOR JOB ========================
const getMatchesByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const matches = await Match.find({ jobId }).populate("userId", [
      "username",
      "location",
      "skills",
      "profile",
    ]);

    if (!matches.length) {
      return res.status(404).json({ message: "No matched users found" });
    }

    res.status(200).json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// ======================== EXPORTS ========================
export  {
  addMatch,
  getMatchesByJob,
};
