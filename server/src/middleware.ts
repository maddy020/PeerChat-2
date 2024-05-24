import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default async function getUser(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.headers) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
  }
}
