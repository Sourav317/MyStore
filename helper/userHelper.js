import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

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
      return true;
    } catch (error) {
      console.log(error);
      return {
        status: "failed",
        message: "Unable to Register" + ` error - ${error}`,
      };
    }
  }

  static async loginUser(name, password, userName, userPassword) {
    try {
      const isMatch = await bcrypt.compare(password, userPassword);
      return userName === name && isMatch;
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
