import { Response } from "express";

export const errorResponse = (
  res: Response,
  message?: string,
  status_code?: number
) => {
  return res.status(status_code || 400).json({
    success: false,
    message: message || "An error occurred",
  });
};

export const successResponse = <T>(
  res: Response,
  data?: T,
  message?: string,
  status_code?: number
) => {
  return res
    .status(status_code || 200)
    .json({ success: true, message, data: data ?? {} });
};