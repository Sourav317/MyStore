import express from "express";
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";

const router = express.Router();

// Route Level Middleware - To Protect Route
router.use("/loggeduser", checkUserAuth);

// Public Routes
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);

// Protected Routes
router.get("/loggeduser", UserController.loggedUser);

export default router;
