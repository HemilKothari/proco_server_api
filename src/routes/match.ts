import { Router } from "express";
import { addMatch, getMatchesByJob } from "../controllers/matchController";
const matchRouter = Router();

matchRouter.post("/", addMatch);
matchRouter.get("/:jobId", getMatchesByJob);

export  {matchRouter};
