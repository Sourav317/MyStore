import express from "express";
import dotenv from "dotenv";
import connectDB from "./configs/connectDB.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL;

// Database Connection
connectDB(DATABASE_URL);

// JSON
app.use(express.json());

// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });

// Load Routes
app.use("/api/user", userRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
