import { Router } from "express";
import { authRouter } from "./auth";
import { chatRouter } from "./chat";
import { filterRouter } from "./filter";
import { jobRouter } from "./job";
import { matchRouter } from "./match";
import { swipeRouter } from "./swipe";
import { messageRouter } from "./messages";
import { userRouter } from "./user";


export const router = Router();

router.use("/api/", authRouter);
router.use("/api/users", userRouter);
router.use("/api/jobs", jobRouter);
// router.use("/api/bookmarks", bookmarkRoute);
router.use("/api/chats", chatRouter);
router.use("/api/messages", messageRouter);
router.use("/api/filters", filterRouter);
router.use("/api/matches", matchRouter);
router.use("/api/swipes", swipeRouter);