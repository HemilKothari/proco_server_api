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
      return errorResponse(res, "Job is required", 400);
    }

    if (!Types.ObjectId.isValid(job)) {
      return errorResponse(res, "Invalid job id", 400);
    }

    const existingJob = await Job.findById(job);
    if (!existingJob) {
      return errorResponse(res, "Job not found", 404);
    }

    // ✅ Check duplicate bookmark
    const existingBookmark = await Bookmark.findOne({
      job: new Types.ObjectId(job),
      userId: new Types.ObjectId(userId),
    });

    if (existingBookmark) {
      return errorResponse(res, "Bookmark already exists", 409);
    }

    const bookmark = new Bookmark({
      job: new Types.ObjectId(job),
      userId: new Types.ObjectId(userId),
    });

    const savedBookmark = await bookmark.save();

    return successResponse(
      res,
      savedBookmark,
      "Bookmark created successfully",
      201
    );
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

    const deletedBookmark = await Bookmark.findOneAndDelete({
      userId: new Types.ObjectId(userId),
      job: new Types.ObjectId(jobId),
    });

    // ✅ Check if bookmark existed
    if (!deletedBookmark) {
      return errorResponse(res, "Bookmark not found", 404);
    }

    return successResponse(
      res,
      {},
      "Bookmark successfully deleted",
      200
    );
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

    // ✅ Empty check (consistent with other controllers)
    if (!bookmarks || bookmarks.length === 0) {
      return successResponse(res, [], "No bookmarks found", 200);
    }

    return successResponse(
      res,
      bookmarks,
      "Bookmarks fetched successfully",
      200
    );
  } catch (error: unknown) {
    console.error("Error fetching bookmarks:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

export { createBookmark, deleteBookmark, getBookmarks };