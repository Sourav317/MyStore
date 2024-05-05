import express from "express";
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";
import requireRole from "../middlewares/role-middleware.js";
import upload from "../middlewares/upload-middleware.js";

const router = express.Router();

// Route Level Middleware - To Protect Route
router.use("/loggeduser", checkUserAuth);
router.use("/transactionLogs", [checkUserAuth, requireRole]);

// Public Routes
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);
router.put("/uploads", upload.single("profile"), UserController.UploadFile);
router.get("/getBuckets", UserController.getBucketList);
router.get("/getFiles", UserController.getBucketFiles);

// Protected Routes
router.get("/loggeduser", UserController.loggedUser);
router.get("/transactionLogs", UserController.transactionLogs);

export default router;
