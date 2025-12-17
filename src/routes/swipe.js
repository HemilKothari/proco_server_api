const express = require("express");
const { addSwipe, getSwipesByJob } = require("../controllers/swipeController");
const router = express.Router();

router.post("/", addSwipe);
router.get("/:jobId", getSwipesByJob);

module.exports = router;
