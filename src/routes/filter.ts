import { Router } from "express";
import { createFilter, deleteFilter, getFilterById, getFilters, updateFilter } from "../controllers/filterController";
// const { verifyTokenAndAgent } = require("../middleware/verifyToken");

const filterRouter = Router();
// CREATE FILTER
filterRouter.post("/", createFilter);

// UPDATE FILTER
filterRouter.put("/:id", updateFilter);

// DELETE FILTER
filterRouter.delete("/:id", deleteFilter);

// GET ALL FILTERS
filterRouter.get("/", getFilters);

// GET FILTER BY AGENT ID
filterRouter.get("/:id", getFilterById);

export  {filterRouter};
