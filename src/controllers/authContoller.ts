import User from "../models/User";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { emailRegex, minPasswordLength } from "../constants";
import { CreateUserBody, LoginUserBody } from "../types";
import { errorResponse, successResponse } from "../utils/response";

// ======================== CREATE USER ========================
const createUser = async (
  req: Request<{}, {}, CreateUserBody>,
  res: Response) => 
  {
    if (!emailRegex.test(req.body.email as string)) {
        return errorResponse(res, "Invalid email format", 400);
    }

    if (req.body.password.length as number < minPasswordLength) {
      return errorResponse(res, `Password should be at least ${minPasswordLength} characters long`, 400);
    }

    const emailExist = await User.findOne({ email: req.body.email as string });
    if (emailExist) {
        return errorResponse(res, "Email already exists", 400);
    }

    const newUser = new User({
      username: req.body.username as string,
      email: req.body.email as string,
      password: CryptoJS.AES.encrypt(
        req.body.password as string,
        process.env.SECRET
      ).toString(),
      college: req.body.college as string,
      gender: req.body.gender as string,
      branch: req.body.branch as string,
      city: req.body.city as string,
      state: req.body.state as string,
      country: req.body.country as string,
      isFirstTimeUser: false, // Mark as completed registration
    });

    try {
      await newUser.save();
      successResponse(res, [], "User created successfully", 201);
    } catch (error) {
        const message =
          error instanceof Error ? error.message : "Internal server error";
        errorResponse(res, message, 500);
    }

};

// ======================== LOGIN USER ========================
const loginUser = async (
  req: Request<{}, {}, LoginUserBody>,
  res: Response) => {
    try {
      const user = await User.findOne({ email: req.body.email as string});
      if (!user) {
        return errorResponse(res, "Wrong Email Address", 401);
      }

      const decryptedPass = CryptoJS.AES.decrypt(
        user.password as string,
        process.env.SECRET
      );
      const depassword = decryptedPass.toString(CryptoJS.enc.Utf8);

      if (depassword!== req.body.password as string) {
        return errorResponse(res, "Provide a correct password", 401);
      }

      /* Uncomment this block if you want to enforce profile completeness:
      if (!user.college || !user.gender || !user.branch || !user.city || !user.state || !user.country) {
        return res.status(403).json({
          status: false,
          message: "Complete your profile with college, gender, branch, city, state, and country information."
        });
      }
      */

      const userToken = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin, isAgent: user.isAgent },
        process.env.JWT_SEC,
        { expiresIn: "21d" }
      );

      const { password, __v, createdAt, ...others } = (user as any)._doc;
      successResponse(res, { ...others, userToken }, "Login successful", 200);
      
    } catch (error) {
      errorResponse(res, error.message, 500);
    }
};

// ======================== EXPORTS ========================
export  { createUser, loginUser };
