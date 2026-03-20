import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// ======================== VERIFY TOKEN ========================
const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.headers.token as string | undefined;

  if (!authHeader) {
    return res.status(401).json({
      status: false,
      message:
        "You do not have permission to access this route, Incorrect Token",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Token is missing",
    });
  }

  jwt.verify(
    token,
    process.env.JWT_SEC as string,
    (err, decoded) => {
      if (err || !decoded) {
        return res.status(403).json({
          status: false,
          message: "Token is not valid!",
        });
      }

      const user = decoded as JwtPayload;

      req.user = {
        id: user.id as string,
        isAdmin: Boolean(user.isAdmin),
        isAgent: Boolean(user.isAgent),
      };

      next();
    }
  );
};

// ======================== VERIFY TOKEN & AUTH ========================
const verifyTokenAndAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  verifyToken(req, res, () => {
    if (req.user?.id || req.user?.isAdmin) {
      next();
    } else {
      res.status(403).json({
        status: false,
        message:
          "You do not have permission to access this route, Not admin and incorrect user",
      });
    }
  });
};

// ======================== VERIFY TOKEN & ADMIN ========================
const verifyTokenAndAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  verifyToken(req, res, () => {
    if (req.user?.isAdmin) {
      next();
    } else {
      res.status(403).json({
        status: false,
        message:
          "You do not have permission to access this route, Not Admin",
      });
    }
  });
};

// ======================== VERIFY TOKEN & AGENT ========================
const verifyTokenAndAgent = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  verifyToken(req, res, () => {
    if (req.user?.isAgent || req.user?.isAdmin) {
      next();
    } else {
      res.status(403).json({
        status: false,
        message:
          "You do not have permission to access this route, incorrect agent/Admin",
      });
    }
  });
};

export {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyTokenAndAgent,
};