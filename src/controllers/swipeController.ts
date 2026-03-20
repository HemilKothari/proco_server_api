import { Request, Response } from "express";
import { Types, Error as MongooseError } from "mongoose";
import Swipe from "../models/Swipe";
import { SwipeUserBody } from "../types";
import { errorResponse, successResponse } from "../utils/response";
import Job from "../models/Job";
import User from "../models/User";

// ======================== ADD SWIPE ========================
export const addSwipe = async (
  req: Request<{}, {}, SwipeUserBody>,
  res: Response
): Promise<Response> => {
  try {
    const { jobId, userId } = req.body;

    if (!jobId || !userId) {
      return errorResponse(res, "jobId and userId are required", 400);
    }

    const newSwipe = new Swipe({
      jobId: new Types.ObjectId(jobId),
      userId: new Types.ObjectId(userId),
    });

    await newSwipe.save();

    return successResponse(res, newSwipe, "User swiped successfully", 201);
  } catch (error: unknown) {
    if (
      error instanceof MongooseError &&
      "code" in error &&
      error.code === 11000
    ) {
      return errorResponse(res, "User already swiped for this job", 409);
    }

    console.error("Error adding swipe:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

// ======================== GET SWIPES FOR JOB ========================
export const getSwipesByJob = async (
  req: Request<{ jobId: string }>,
  res: Response
): Promise<Response> => {
  try {
    const { jobId } = req.params;

    if (!Types.ObjectId.isValid(jobId)) {
      return errorResponse(res, "Invalid jobId", 400);
    }
    const job = await Job.findById(jobId);

    if (!job) {
      return errorResponse(res, "Job not found", 404);
    }

    const swipedUserIds = job.swipedUsers || [];

    if (swipedUserIds.length === 0) {
      return successResponse(res, [], "No swipes found for this job", 200);
    }

    const users = await User.find({
      _id: { $in: swipedUserIds },
    }).select("username skills profile location");

    return successResponse(
      res,
      users,
      "Swipes retrieved successfully",
      200
    );
  } catch (error: unknown) {
    console.error("Error fetching swipes:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};