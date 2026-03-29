import { Router } from "express";
import { createJob, updateJob, deleteJob, getJob, getAllJobs, searchJobs, getUserJobs, getFilteredJobs } from "../controllers/jobController";

import { verifyTokenAndAgent } from "../middleware/verifyToken";
import upload from "../middleware/multer";
const jobRouter = Router();

// CREATE JOB
jobRouter.post("/", upload.single("image"), createJob);

// UPADATE JOB
jobRouter.put("/:id", verifyTokenAndAgent, updateJob);

// DELETE JOB
jobRouter.delete("/:id", verifyTokenAndAgent, deleteJob);

// GET ALL JOBS
jobRouter.get("/", getAllJobs);

// SEARCH FOR JOBS
jobRouter.get("/search/:key", searchJobs);

// GET ALL JOBS BY A USER
jobRouter.get("/user/:agentId", getUserJobs);

// GET FILTERED JOBS FOR A USER
jobRouter.get("/filtered/:agentId", getFilteredJobs);

// GET JOB BY ID (must be last to avoid catching other routes)
jobRouter.get("/:id", getJob);

export  {jobRouter};
