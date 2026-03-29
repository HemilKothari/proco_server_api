import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/response";
import { SimpleRecommendationService } from "../utils/simpleRecommendation";

const recommendationService = new SimpleRecommendationService();

// ======================== GET RECOMMENDED JOBS ========================
const getRecommendedJobs = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId || req.query.userId;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    if (!userId) {
      return errorResponse(res, "userId is required", 400);
    }

    const recommendations = await recommendationService.getRecommendations(
      userId as string,
      limit
    );

    return successResponse(
      res,
      recommendations,
      "Recommended jobs fetched successfully",
      200
    );
  } catch (error: any) {
    console.error("Error fetching recommendations:", error);

    if (error.message === "User not found") {
      return errorResponse(res, error.message, 404);
    }

    return errorResponse(res, "Failed to fetch recommendations", 500);
  }
};

export default getRecommendedJobs;