import mongoose from "mongoose";
import { seedProducts } from "../controllers/productController.js";

const ConnectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    seedProducts()
    console.log("Database connected successfully")
  } catch (error) {
    console.error("Database connection failed:", error.message)
    process.exit(1) 
  }
};

export default ConnectDb;
