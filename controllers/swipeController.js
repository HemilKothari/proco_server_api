const Swipe = require("../models/Swipe");

// ======================== ADD SWIPE ========================
const addSwipe = async (req, res) => {
  try {
    const { jobId, userId } = req.body;

    if (!jobId || !userId) {
      return res.status(400).json({ message: "jobId and userId are required" });
    }

    const newSwipe = new Swipe({ jobId, userId });
    await newSwipe.save();

    res
      .status(200)
      .json({ message: "User swiped successfully", swipe: newSwipe });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already swiped this job" });
    }
    console.error("Error adding swipe:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// ======================== GET SWIPES FOR JOB ========================
const getSwipesByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const swipes = await Swipe.find({ jobId }).populate("userId", [
      "username",
      "location",
      "skills",
      "profile",
    ]);

    if (!swipes.length) {
      return res.status(404).json({ message: "No swiped users found" });
    }

    res.status(200).json(swipes);
  } catch (error) {
    console.error("Error fetching swipes:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// ======================== EXPORTS ========================
module.exports = {
  addSwipe,
  getSwipesByJob,
};
