import { Router } from "express";
import { verifyTokenAndAuthorization, verifyToken } from "../middleware/verifyToken";
const {
  createBookmark,
  deleteBookmark,
  getBookmarks
} = require("../controllers/bookmarkController");
const bookmarkRoute = Router();

// CREATE BOOKMARKS
bookmarkRoute.post("/", verifyTokenAndAuthorization, createBookmark);

// DELETE BOOKMARKS
bookmarkRoute.delete("/:id", verifyToken, deleteBookmark);

// GET BOOKMARKS
bookmarkRoute.get("/", verifyTokenAndAuthorization, getBookmarks);

export  {bookmarkRoute};
