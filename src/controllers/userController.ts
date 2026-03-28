import User from "../models/User";
import CryptoJS from "crypto-js";
import { Request, Response } from "express";
import { UpdateUserBody } from "../types";
import { errorResponse, successResponse } from "../utils/response";
import cloudinary from "../utils/cloudinary";

// ======================== UPDATE USER ========================
const updateUser = async (
  req: Request<{}, {}, UpdateUserBody> & { file?: Express.Multer.File },
  res: Response
) => {
  try {
    if (!req.user.id) {
      return errorResponse(res, "User ID is required", 400);
    }

    const updateData: Partial<UpdateUserBody>  = {
      ...req.body,
    };

    for (const key of Object.keys(updateData) as (keyof typeof updateData)[]) {
      if (
        updateData[key] === undefined ||
        updateData[key] === null ||
        updateData[key] === ""
      ) {
        delete updateData[key];
      }
    }

    if (updateData.password) {
      updateData.password = CryptoJS.AES.encrypt(
        updateData.password,
        process.env.SECRET as string
      ).toString();
    }

    if (req.file) {
      const uploaded: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "user_profiles" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        ).end(req.file.buffer);
        
      });

      

      if (!uploaded?.secure_url) {
        return errorResponse(res, "Image upload failed", 500);
      }

      updateData.profile = uploaded.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return errorResponse(res, "Cannot update user", 404);
    }

    const { password, __v, createdAt, ...others } =
      (updatedUser as any)._doc;

    return successResponse(res, others, "User updated successfully", 200);
  } catch (err) {
    console.error(err);
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
