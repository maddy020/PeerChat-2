import mongoose from "mongoose";
import { Request, Response } from "express";
import { userTypes } from "../types/index";
import jwt from "jsonwebtoken";
import User from "../models/userSchema";
import bcrypt from "bcrypt";

async function handleLogin(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    const user: userTypes | null = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedpassword = user.password;
    const validPassword = await bcrypt.compare(password, hashedpassword);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid Credentials" });
    const id = user._id;
    const token = jwt.sign({ id }, process.env.JWT_SECRET as string);
    return res
      .status(201)
      .json({ message: "User Logged In", token: token, id: id });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Unauthorized" });
  }
}

async function handleSignup(req: Request, res: Response) {
  try {
    const { name, username, password } = req.body;
    const existingUser: userTypes | null = await User.findOne({ username });
    if (existingUser != null)
      return res.status(404).json({ message: "User already exist" });
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      username,
      password: hashedpassword,
      peerId: name,
    });
    const id = user._id;
    const token = jwt.sign({ id }, process.env.JWT_SECRET as string);
    return res.status(201).json({ message: "User Created", token: token });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error in signup" });
  }
}

export { handleLogin, handleSignup };
