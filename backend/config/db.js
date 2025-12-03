import mongoose from "mongoose";

export const dbconnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log("connected");
  } catch (error) {
    console.log("not connected");
  }
};
