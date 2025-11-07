import mongoose from "mongoose";
import { seedProducts } from "../controllers/productController.js";

const ConnectDb = async () => {
  try {
    await mongoose.connect(`mongodb+srv://shahid:ns2009517@cluster1.zsjwipv.mongodb.net/nexora`);
    seedProducts()
    console.log("Database connected successfully")
  } catch (error) {
    console.error("Database connection failed:", error.message)
    process.exit(1) 
  }
};

export default ConnectDb;
