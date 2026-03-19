import Job from"../models/Job";
import { Request, Response } from "express";
import { JobDocument } from "../types";
import { errorResponse, successResponse } from "../utils/response";

// ======================== CREATE JOB ========================
const createJob = async (req: Request, res: Response) => {
  const newJob: JobDocument = new Job(req.body as JobDocument);

  try {
    const savedJob = await newJob.save();
    if (!savedJob) {
      return errorResponse(res, "Failed to create job", 500);
    }
    const { ...newJobInfo } = savedJob.toObject();
    successResponse(res, newJobInfo, "Job created successfully", 201);
  } catch (error) {
    errorResponse(res, "Error creating job", 500);
  }
};

// ======================== UPDATE JOB ========================
const updateJob = async (req: Request, res: Response) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id as string,
      { $set: req.body },
      { new: true }
    );

    const { password, __v, createdAt, ...job } = updatedJob.toObject();
    successResponse(res, job, "Job updated successfully", 200);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ======================== DELETE JOB ========================
const deleteJob = async (req: Request, res: Response) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json("Job Successfully Deleted");
    
  } catch (error) {
    res.status(500).json(error);
  }
};

// ======================== GET JOB BY ID ========================
const getJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    const { __v, createdAt, ...jobData } = job._doc;
    res.status(200).json(jobData);
  } catch (error) {
    res.status(500).json(error);
  }
};

// ======================== GET ALL JOBS ========================
const getAllJobs = async (req: Request, res: Response) => {
  const recent = req.query.new;
  try {
    let jobs;
    if (recent) {
      jobs = await Job.find().sort({ createdAt: -1 }).limit(2);
    } else {
      jobs = await Job.find();
    }
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json(error);
  }
};

// ======================== SEARCH JOBS ========================
const searchJobs = async (req: Request, res: Response) => {
  try {
    const results = await Job.aggregate([
      {
        $search: {
          index: "jobsearch",
          text: {
            query: req.params.key,
            path: {
              wildcard: "*",
            },
          },
        },
      },
    ]);
    res.status(200).send(results);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ======================== GET USER JOBS ========================
const getUserJobs = async (req: Request, res: Response) => {
  console.log("getUserJobs function called with agentId:", req.params.id);
  try {
    const agentId = req.params.agentId;
    const jobs = await Job.find({ agentId: agentId });

    if (!jobs.length) {
      console.log(`No jobs found for agentId: ${agentId}`);
      return res.status(404).json({ message: "No jobs found for this user." });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching user jobs:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// ======================== EXPORTS ========================
export  {
  createJob,
  updateJob,
  deleteJob,
  getJob,
  getAllJobs,
  searchJobs,
  getUserJobs,
};
