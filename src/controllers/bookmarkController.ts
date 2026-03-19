import { Response } from "express";
import { Types } from "mongoose";
import Bookmark from "../models/Bookmark";
import Job from "../models/Job";
import { AuthenticatedRequest, CreateBookmarkBody } from "../types";
import { errorResponse, successResponse } from "../utils/response";

// ======================== CREATE BOOKMARK ========================
const createBookmark = async (
  req: AuthenticatedRequest<{}, {}, CreateBookmarkBody>,
  res: Response
): Promise<Response> => {
  try {
    const { job } = req.body;
    const userId = req.user.id;

    if (!job) {
      return errorResponse(res, "job is required", 400);
    }

    if (!Types.ObjectId.isValid(job)) {
      return errorResponse(res, "Invalid job id", 400);
    }

    const existingJob = await Job.findById(job);
    if (!existingJob) {
      return errorResponse(res, "Job not found", 404);
    }

    const bookmark = new Bookmark({
      job: new Types.ObjectId(job),
      userId: new Types.ObjectId(userId),
    });

    const savedBookmark = await bookmark.save();

    return successResponse(res, savedBookmark, "Bookmark created successfully", 201);
  } catch (error: unknown) {
    console.error("Error creating bookmark:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

// ======================== DELETE BOOKMARK ========================
const deleteBookmark = async (
  req: AuthenticatedRequest<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;

    if (!Types.ObjectId.isValid(jobId)) {
      return errorResponse(res, "Invalid job id", 400);
    }

    await Bookmark.findOneAndDelete({
      userId: new Types.ObjectId(userId),
      job: new Types.ObjectId(jobId),
    });

    return successResponse(res, {}, "Bookmark successfully deleted", 200);
  } catch (error: unknown) {
    console.error("Error deleting bookmark:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

// ======================== GET BOOKMARKS ========================
const getBookmarks = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const bookmarks = await Bookmark.find({
      userId: new Types.ObjectId(req.user.id),
    }).populate("job", "-requirements");

    return successResponse(res, bookmarks, "Bookmarks fetched successfully", 200);
  } catch (error: unknown) {
    console.error("Error fetching bookmarks:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

export { createBookmark, deleteBookmark, getBookmarks };