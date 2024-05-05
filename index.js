import express from "express";
import dotenv from "dotenv";
import connectDB from "./configs/connectDB.js";
import userRoutes from "./routes/userRoutes.js";
import multer from "multer";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL;

// Database Connection
connectDB(DATABASE_URL);

// JSON
app.use(express.json());

// Load Routes
app.use("/api/user", userRoutes);

function errHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.json({
      success: 0,
      message: err.message,
    });
  }
}
app.use(errHandler);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
