import Job from"../models/Job";
import Filter from "../models/Filter";
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
    const {
      title,
      agentId,
      company,
      description,
      salary,
      period,
      hiring,
      contract,
      requirements,
      imageUrl,
      domain,
      opportunityType,
      pincode,
      city,
      state,
      country,
    } = req.body;

    if (!title || !agentId) {
      return errorResponse(res, "title and agentId are required", 400);
    }

    if (!Types.ObjectId.isValid(agentId)) {
      return errorResponse(res, "Invalid agentId", 400);
    }

    // Optional manual duplicate check (fallback)
    const existingJob = await Job.findOne({
      title,
      agentId: new Types.ObjectId(agentId),
    });

    if (existingJob) {
      return errorResponse(
        res,
        "Duplicate job: same title and agent already exists",
        409
      );
    }

    const newJob = new Job({
      title,
      agentId: new Types.ObjectId(agentId),
      company: company || "",
      description: description || "",
      salary: salary || "",
      period: period || "",
      hiring: hiring ?? false,
      contract: contract || "",
      requirements: requirements || [],
      imageUrl: imageUrl || "",
      domain: domain || "",
      opportunityType: opportunityType || "",
      pincode: pincode || "",
      city: city || "",
      state: state || "",
      country: country || "",
    });

    const savedJob = await newJob.save();

    const jobObj = savedJob.toObject();

    return successResponse(res, jobObj, "Job created successfully", 201);
  } catch (error: unknown) {
    if (
      error instanceof MongooseError &&
      "code" in error &&
      error.code === 11000
    ) {
      return errorResponse(res, "Duplicate job detected (unique constraint)", 409);
    }
    const errMsg = error instanceof Error ? error.message : "Failed to create job";
    return errorResponse(res, errMsg, 500);
  }
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
  try {
    const agentId = req.params.agentId;
    const jobs = await Job.find({ agentId: agentId });

    if (!jobs.length) {
      return successResponse(res, [], "No jobs found for this user.", 200);
    }

    successResponse(res, jobs, "User jobs found", 200);
  } catch (error) {
    console.error("Error fetching user jobs:", error);
    errorResponse(res, "Failed to fetch user jobs", 500);
  }
};

// ======================== GET FILTERED JOBS BY AGENT ========================
const getFilteredJobs = async (req: Request<{ agentId: string }>, res: Response) => {
  try {
    const { agentId } = req.params;

    if (!Types.ObjectId.isValid(agentId)) {
      return errorResponse(res, "Invalid agentId", 400);
    }

    const filter = await Filter.findOne({ agentId: new Types.ObjectId(agentId) });

    // No filter saved yet — return all jobs
    if (!filter) {
      const jobs = await Job.find();
      return successResponse(res, jobs, "Jobs found", 200);
    }

    const query: Record<string, unknown> = {};

    // Category filter (selectedOptions + customOptions)
    const allSelectedOptions = [
      ...(filter.selectedOptions || []),
      ...(filter.customOptions || []),
    ];
    if (allSelectedOptions.length > 0) {
      query.domain = { $in: allSelectedOptions };
    }

    // Opportunity type filter
    const activeTypes: string[] = [];
    if (filter.opportunityTypes) {
      for (const [type, enabled] of (filter.opportunityTypes as Map<string, boolean>).entries()) {
        if (enabled) activeTypes.push(type);
      }
    }
    if (activeTypes.length > 0) {
      query.opportunityType = { $in: activeTypes };
    }

    // Location filter — matches against job.city, job.state, job.country
    if (filter.selectedLocationOption === "City" && filter.selectedCity) {
      query.city = { $regex: filter.selectedCity, $options: "i" };
    } else if (filter.selectedLocationOption === "State" && filter.selectedState) {
      query.state = { $regex: filter.selectedState, $options: "i" };
    } else if (filter.selectedLocationOption === "Country" && filter.selectedCountry) {
      query.country = { $regex: filter.selectedCountry, $options: "i" };
    }

    const jobs = await Job.find(query);
    return successResponse(res, jobs, "Jobs found", 200);
  } catch (error) {
    return errorResponse(res, "Failed to fetch filtered jobs", 500);
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
  getFilteredJobs,
};
