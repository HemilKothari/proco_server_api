import { Request, Response } from "express";
import { Types } from "mongoose";
import { MongoServerError } from 'mongodb';
import Match from "../models/Match";
import { MatchUserBody } from "../types";
import { errorResponse, successResponse } from "../utils/response";

// ======================== ADD MATCH ========================
export const addMatch = async (
  req: Request<{}, {}, MatchUserBody>,
  res: Response
): Promise<Response> => {
  try {
    const { jobId, userId } = req.body;

    if (!jobId || !userId) {
      return errorResponse(res, "jobId and userId are required", 400);
    }

    const newMatch = new Match({
      jobId: new Types.ObjectId(jobId),
      userId: new Types.ObjectId(userId),
    });

    await newMatch.save();

    return successResponse(res, newMatch, "User matched successfully", 201);
  } catch (error: unknown) {
    // ✅ MongoServerError is what the driver actually throws for duplicate keys
    if (error instanceof MongoServerError && error.code === 11000) {
      return errorResponse(res, "User already matched for this job", 409);
    }

    console.error("Error adding match:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

// ======================== GET MATCHES FOR JOB ========================
export const getMatchesByJob = async (
  req: Request<{ jobId: string }>,
  res: Response
): Promise<Response> => {
  try {
    const { jobId } = req.params;

    if (!Types.ObjectId.isValid(jobId)) {
      return errorResponse(res, "Invalid jobId", 400);
    }

    const matches = await Match.find({
      jobId: new Types.ObjectId(jobId),
    }).populate("userId", [
      "username",
      "location",
      "skills",
      "profile",
    ]);

    if (matches.length === 0) {
      return errorResponse(res, "No matched users found", 404);
    }

    return successResponse(res, matches, "Matches retrieved successfully", 200);
  } catch (error: unknown) {
    console.error("Error fetching matches:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};