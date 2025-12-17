import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';


const verifyToken = (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, async (err, user) => {
            if (err){
                return res.status(403).json({status: false, message: "Token is not valid!"});
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({status: false, message: "You do not have permission to access this route, Incorrect Token"});
    }
};

const verifyTokenAndAuthorization = (req:Request, res:Response, next:NextFunction) => {
    verifyToken(req, res, () => {
        if (req.user.id || req.user.isAdmin) {
            next();
        } else {
           return res.status(403).json({status: false, message: "You do not have permission to access this route, Not admin and incorrect user"});
        }
    });
};

const verifyTokenAndAdmin = (req:Request, res:Response, next:NextFunction) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({status: false, message: "You do not have permission to access this route, Not Admin"});
        }
    });
};


const verifyTokenAndAgent = (req:Request, res:Response, next:NextFunction) => {
    verifyToken(req, res, () => {
        if (req.user.isAgent || req.user.isAdmin) {
            next();
        } else {
           return res.status(403).json({status: false, message: "You do not have permission to access this route, incorrecr agent/Admin"});
        }
    });
};

export { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyTokenAndAgent };
