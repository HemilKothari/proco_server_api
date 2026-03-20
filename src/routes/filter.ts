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

// GET FILTER BY ID
filterRouter.get("/:id", getFilterById);

// GET ALL FILTERS
//router.get("/",verifyTokenAndAgent, getAllFilters);
filterRouter.get("/:id", getFilters);

export  {filterRouter};
