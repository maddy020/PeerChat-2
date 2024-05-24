import mongoose, { model, mongo } from "mongoose";
import { userTypes } from "../types/index";

const userSchema = new mongoose.Schema<userTypes | null>({
  name: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },
  username: {
    type: "string",
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
