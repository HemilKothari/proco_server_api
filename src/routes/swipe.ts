import { Router } from "express";
const { addSwipe, getSwipesByJob } = require("../controllers/swipeController");
const swipeRouter = Router();

swipeRouter.post("/", addSwipe);
swipeRouter.get("/:jobId", getSwipesByJob);

export  {swipeRouter};
