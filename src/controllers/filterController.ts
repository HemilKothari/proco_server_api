import { Request, Response } from "express";
import { Types } from "mongoose";
import Filter from "../models/Filter";

// ======================== CREATE FILTER ========================
const createFilter = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { agentId, ...rest } = req.body;

    const filter = await Filter.findOneAndUpdate(
      { agentId },
      { agentId, ...rest },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(201).json({
      message: "Filter created successfully",
      data: filter,
    });
  } catch (error: unknown) {
    console.error("Error creating filter:", error);
    return res.status(500).json({
      message: "Error creating filter",
    });
  }
};

// ======================== GET ALL FILTERS ========================
const getFilters = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const filters = await Filter.find();

    return res.status(200).json({
      message: "Filters fetched successfully",
      data: filters,
    });
  } catch (error: unknown) {
    console.error("Error fetching filters:", error);
    return res.status(500).json({
      message: "Error fetching filters",
    });
  }
};

// ======================== GET FILTER BY AGENT ID ========================
const getFilterById = async (
  req: Request<{ agentId: string }>,
  res: Response
): Promise<Response> => {
  try {
    const { agentId } = req.params;

    if (!Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({
        message: "Invalid agentId",
      });
    }

    const filter = await Filter.findOne({
      agentId: new Types.ObjectId(agentId),
    });

    if (!filter) {
      return res.status(404).json({
        message: "Filter not found",
      });
    }

    return res.status(200).json({
      message: "Filter fetched successfully",
      data: filter,
    });
  } catch (error: unknown) {
    console.error("Error fetching filter:", error);
    return res.status(500).json({
      message: "Error fetching filter",
    });
  }
};

// ======================== UPDATE FILTER ========================
const updateFilter = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid filter id",
      });
    }

    const updatedFilter = await Filter.findByIdAndUpdate(
      new Types.ObjectId(id),
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedFilter) {
      return res.status(404).json({
        message: "Filter not found",
      });
    }

    return res.status(200).json({
      message: "Filter updated successfully",
      data: updatedFilter,
    });
  } catch (error: unknown) {
    console.error("Error updating filter:", error);
    return res.status(500).json({
      message: "Error updating filter",
    });
  }
};

// ======================== DELETE FILTER ========================
const deleteFilter = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid filter id",
      });
    }

    const deletedFilter = await Filter.findByIdAndDelete(
      new Types.ObjectId(id)
    );

    if (!deletedFilter) {
      return res.status(404).json({
        message: "Filter not found",
      });
    }

    return res.status(200).json({
      message: "Filter deleted successfully",
      data: deletedFilter,
    });
  } catch (error: unknown) {
    console.error("Error deleting filter:", error);
    return res.status(500).json({
      message: "Error deleting filter",
    });
  }
};

// ======================== EXPORTS ========================
export {
  createFilter,
  getFilters,
  getFilterById,
  updateFilter,
  deleteFilter,
};