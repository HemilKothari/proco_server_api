import { Router } from "express";
import { authRouter } from "./auth";
import { chatRouter } from "./chat";


export const router = Router();

router.use("/api/", authRouter);
router.use("/api/users", userRoute);
router.use("/api/jobs", jobRoute);
router.use("/api/bookmarks", bookmarkRoute);
router.use("/api/chats", chatRouter);
router.use("/api/messages", messageRoute);
router.use("/api/filters", filterRoute);
router.use("/api/matches", matchRoute);
router.use("/api/swipes", swipeRoute);