import Job from"../models/Job";
import Filter from "../models/Filter";
import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import { Types, MongooseError} from "mongoose";
import { JobDocument } from "../types";
import cloudinary from "../utils/cloudinary";

// ======================== CREATE JOB ========================
const createJob = async (
  req: Request & { file?: Express.Multer.File },
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
    } = req.body as JobDocument;

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

    // Upload image to Cloudinary if a file was attached
    let resolvedImageUrl = imageUrl || "";
    if (req.file) {
      const uploaded: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "job_images" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return reject(error);
            }
            resolve(result);
          }
        ).end(req.file!.buffer);
      });

      if (!uploaded?.secure_url) {
        return errorResponse(res, "Image upload failed", 500);
      }
      resolvedImageUrl = uploaded.secure_url;
    }

    // Multipart sends everything as strings — normalise types
    let parsedRequirements: string[] = [];
    if (Array.isArray(requirements)) {
      parsedRequirements = requirements;
    } else if (typeof requirements === "string") {
      try { parsedRequirements = JSON.parse(requirements); } catch { parsedRequirements = []; }
    }

    const parsedHiring = typeof hiring === "boolean"
      ? hiring
      : String(hiring).toLowerCase() === "true";

    const newJob = new Job({
      title,
      agentId: new Types.ObjectId(agentId),
      company: company || "",
      description: description || "",
      salary: salary || "",
      period: period || "",
      hiring: parsedHiring,
      contract: contract || "",
      requirements: parsedRequirements,
      imageUrl: resolvedImageUrl,
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

    // Remove left-swipers: keep only users who are in matchedUsers (right-swipers)
    const matchedSet = new Set(
      (updatedJob.matchedUsers || []).map((id: any) => id.toString())
    );
    const filteredSwiped = (updatedJob.swipedUsers || []).filter((id: any) =>
      matchedSet.has(id.toString())
    );
    await Job.findByIdAndUpdate(req.params.id, {
      $set: { swipedUsers: filteredSwiped },
    });

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
      jobs = await Job.find().sort({ updatedAt: -1 }).limit(2);
    } else {
      jobs = await Job.find().sort({ updatedAt: -1 });
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
    ].filter((opt) => opt.trim() !== "");
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

    // Skills filter — OR logic: job must match at least one selected skill
    const skills: string[] = (filter.skills || []).filter((s: string) => s.trim() !== "");
    if (skills.length > 0) {
      query.$or = skills.map((s: string) => ({
        requirements: { $regex: s, $options: "i" },
      }));
    }

    // Posted-within filter
    if (filter.postedWithin) {
      const msMap: Record<string, number> = {
        "24h": 24 * 60 * 60 * 1000,
        "7d":  7  * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
      };
      const ms = msMap[filter.postedWithin];
      if (ms) query.createdAt = { $gte: new Date(Date.now() - ms) };
    }

    // Always sort by updatedAt desc so updated jobs rank alongside new ones.
    // sortByTime filter uses createdAt to show strictly newest posts first.
    const mongoSort = filter.sortByTime
      ? { createdAt: -1 as const }
      : { updatedAt: -1 as const };
    let jobs = await Job.find(query).sort(mongoSort) as any[];

    // Rank by skill match count descending when skills filter is active
    // (skills re-ranking is applied on top; if both are on, skills wins final order)
    if (skills.length > 0) {
      const skillsLower = skills.map((s: string) => s.toLowerCase());
      jobs = jobs
        .map((job) => {
          const reqs: string[] = (job.requirements || []).map((r: string) => r.toLowerCase());
          const matchCount = skillsLower.filter((s) =>
            reqs.some((r) => r.includes(s) || s.includes(r))
          ).length;
          return { job, matchCount };
        })
        .sort((a, b) => b.matchCount - a.matchCount)
        .map(({ job }) => job);
    }

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
