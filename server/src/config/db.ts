import mongoose from "mongoose";

async function dbconnection(url: string) {
  try {
    await mongoose.connect(url);
    console.log("database connected");
  } catch (error) {
    console.log(error);
    console.log("Error in connection to the db");
  }
}

export default dbconnection;
