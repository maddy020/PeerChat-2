import express from "express";
import { handlegetallUsers, getUserById } from "../controllers/user";
const route = express.Router();
import getUser from "../middleware";

route.get("/getallUsers", getUser, handlegetallUsers);
route.get("/:id", getUser, getUserById);

export default route;
