import { Request, Response } from "express";
import { userTypes } from "../types/index";
import User from "../models/userSchema";
import { ObjectId } from "mongodb";

async function handlegetallUsers(req: any, res: Response) {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } });
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error in getting Users" });
  }
}
async function getUserById(req: Request, res: Response) {
  try {
    const id = new ObjectId(req.params.id);
    const user = await User.findById(id);
    if (!user) return res.status(400).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error in getting Users" });
  }
}

export { handlegetallUsers, getUserById };
