import mongoose from "mongoose";

const connectDB = async () => {
  const mongodbUri: string = process.env.MONGODB_URI || "";
  if (!mongodbUri) {
    process.exit();
  }
  try {
    await mongoose.connect(mongodbUri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
