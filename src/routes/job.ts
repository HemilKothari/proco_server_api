import { Router } from "express";
import { createJob, updateJob, deleteJob, getJob, getAllJobs, searchJobs, getUserJobs } from "../controllers/jobController";

import { verifyTokenAndAgent } from "../middleware/verifyToken";
const jobRouter = Router();

// CREATE JOB
jobRouter.post("/", verifyTokenAndAgent, createJob);

// UPADATE JOB
jobRouter.put("/:id", verifyTokenAndAgent, updateJob);

// DELETE JOB
jobRouter.delete("/:id", verifyTokenAndAgent, deleteJob);

// GET JOB BY ID
jobRouter.get("/:id", getJob);

// GET ALL JOBS
jobRouter.get("/", getAllJobs);

// SEARCH FOR JOBS
jobRouter.get("/search/:key", searchJobs);

// GET ALL JOBS BY A USER
jobRouter.get("/user/:agentId", getUserJobs);

export  {jobRouter};
