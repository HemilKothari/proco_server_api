import {Router} from "express";
import getRecommendedJobs from "../controllers/recommendationController";

const recommendationRouter = Router();

recommendationRouter.get("/", getRecommendedJobs);

export { recommendationRouter };