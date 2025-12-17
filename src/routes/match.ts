const express = require("express");
const { addMatch, getMatchesByJob } = require("../controllers/matchController");
const router = express.Router();

router.post("/", addMatch);
router.get("/:jobId", getMatchesByJob);

export  router;
