import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

class userHelper {
  static async registrationUser(name, password) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const doc = new UserModel({
        name: name,
        password: hashPassword,
      });
      await doc.save();
      const saved_user = await UserModel.findOne({ name: name });
      // Generate JWT Token
      const token = jwt.sign(
        { userID: saved_user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "5d" },
      );
      return { isSuccess: true, token: token };
    } catch (error) {
      console.log(error);
      return {
        status: "failed",
        message: "Unable to Register" + ` error - ${error}`,
      };
    }
  }

  static async loginUser(name, password, user) {
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      let token = "";

      // Generate JWT Token
      if (isMatch)
        token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1d",
        });

      return user.name === name && isMatch
        ? { isSuccess: true, token: token }
        : { isSuccess: false };
    } catch (error) {
      console.log(error);
      return {
        status: "failed",
        message:
          "Unable to Login - Username or Password is incorrect" +
          ` error - ${error}`,
      };
    }
  }
}

export default userHelper;
