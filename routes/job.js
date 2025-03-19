const router = require("express").Router();
const jobController = require("../controllers/jobController");
const { verifyTokenAndAgent } = require("../middleware/verifyToken");

// CREATE JOB
router.post("/", verifyTokenAndAgent, jobController.createJob);

// UPADATE JOB
router.put("/:id", verifyTokenAndAgent, jobController.updateJob);

// DELETE JOB

router.delete("/:id", verifyTokenAndAgent, jobController.deleteJob);

// GET JOB BY ID
router.get("/:id", jobController.getJob);

// GET ALL JOBS
router.get("/", jobController.getAllJobs);

// SEARCH FOR JOBS
router.get("/search/:key", jobController.searchJobs);

// GET ALL JOBS BY A USER
router.get("/user/:agentId", jobController.getUserJobs);

// GET SWIPED USERS
router.get("/user/swipe/:id", jobController.getMatchedUsers);

//ADD SWIPED USERS
router.post("/user/swipe", jobController.addSwipedUser);

module.exports = router;
