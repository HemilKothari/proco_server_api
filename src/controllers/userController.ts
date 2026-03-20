import User from "../models/User";
import CryptoJS from "crypto-js";
import { Request, Response } from "express";
import { UpdateUserBody } from "../types";
import { errorResponse, successResponse } from "../utils/response";

// ======================== UPDATE USER ========================
const updateUser = async (
  req: Request<{}, {}, UpdateUserBody>,
  res: Response) => 
  {
  if (req.body.password ) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET
    ).toString();
  }

  try {
    if (!req.user.id) {
      return errorResponse(res, "User ID is required", 400);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id as string,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return errorResponse(res, "Cannot update user", 404);
    }

    const { password, __v, createdAt, ...others } = (updatedUser as any)._doc;
    return successResponse(res, { ...others }, "User updated successfully", 200);
  } catch (err) {
    return errorResponse(res, "Internal server error", 500);
  }
};

// ======================== DELETE USER ========================
const deleteUser = async (req: Request, res: Response) => {
  try {
    if (!(req.user.id as string) as boolean) {
      return errorResponse(res, "User ID is required", 400);
    }

    await User.findByIdAndDelete(req.user.id as string);
    return successResponse(res, {}, "User deleted successfully", 200);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500);
  }
};

// ======================== GET USER ========================
const getUser = async (req: Request, res: Response) => {
  try {
    if (!(req.user.id as string) as boolean) {
      return errorResponse(res, "User ID is required", 400);
    }

    const user = await User.findById(req.user.id as string);
    if (!user) {
      return errorResponse(res, "Cannot find user", 404);
    }

    const { password, __v, createdAt, ...userdata } = (user as any)._doc;
    return successResponse(res, userdata, "User fetched successfully", 200);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500);
  }
};

// ======================== GET ALL USERS ========================

const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const allUsers = await User.find();

    if (!allUsers || allUsers.length === 0) {
      return successResponse(res, [], "No users found", 200);
    }

    return successResponse(res, allUsers, "Users retrieved successfully", 200);

  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal server error", 500);
  }
};

// ======================== EXPORTS ========================
export  {
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
};
