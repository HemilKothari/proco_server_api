import Job from"../models/Job";
import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import { Types, MongooseError} from "mongoose";

// ======================== CREATE JOB ========================
const createJob = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Basic validation
    const { title, location, agentId } = req.body;

    if (!title || !location || !agentId) {
      return errorResponse(res, "title, location and agentId are required", 400);
    }

    if (!Types.ObjectId.isValid(agentId)) {
      return errorResponse(res, "Invalid agentId", 400);
    }

    // Optional manual duplicate check (fallback)
    const existingJob = await Job.findOne({
      title,
      location,
      agentId: new Types.ObjectId(agentId),
    });

    if (existingJob) {
      return errorResponse(
        res,
        "Duplicate job: same title, location, and agent already exists",
        409
      );
    }

    const newJob = new Job({
      ...req.body,
      agentId: new Types.ObjectId(agentId),
    });

    const savedJob = await newJob.save();

    const jobObj = savedJob.toObject();

    return successResponse(res, jobObj, "Job created successfully", 201);
  } catch (error: unknown) {
    // ======================== DUPLICATE KEY ERROR ========================
    if (
      error instanceof MongooseError &&
      "code" in error &&
      error.code === 11000
    ) {
      return errorResponse(
        res,
        "Duplicate job detected (unique constraint)",
        409
      );
    }
  };
}

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
    errorResponse(res, "Failed to update job", 500);
  }
};

// ======================== DELETE JOB ========================
const deleteJob = async (req: Request, res: Response) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    successResponse(res, null, "Job Successfully Deleted", 200);
    
  } catch (error) {
    errorResponse(res, "Failed to delete job", 500);
  }
};

// ======================== GET JOB BY ID ========================
const getJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    const { __v, createdAt, ...jobData } = job._doc;
    successResponse(res, jobData, "Job found", 200);
  } catch (error) {
    errorResponse(res, "Failed to fetch job", 500);
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
    successResponse(res, jobs, "Jobs found", 200);
  } catch (error) {
    errorResponse(res, "Failed to fetch jobs", 500);
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
    successResponse(res, results, "Jobs found", 200);
  } catch (err) {
    errorResponse(res, "Failed to search jobs", 500);
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

    successResponse(res, jobs, "User jobs found", 200);
  } catch (error) {
    console.error("Error fetching user jobs:", error);
    errorResponse(res, "Failed to fetch user jobs", 500);
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
