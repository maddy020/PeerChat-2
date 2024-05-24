import express from "express";
import { handleLogin, handleSignup } from "../controllers/auth";
const route = express.Router();

route.post("/login", handleLogin);
route.post("/signup", handleSignup);

export default route;
