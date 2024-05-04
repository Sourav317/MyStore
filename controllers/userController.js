import UserModel from "../models/User.js";
import bcrypt from "bcrypt";

class UserController {
  static userRegistration = async (req, res) => {
    const { name, password } = req.body;
    const user = await UserModel.findOne({ name: name });
    if (user) {
      res
        .status(404)
        .send({ status: "failed", message: "Username already exists" });
    } else {
      if (name && password) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);
          const doc = new UserModel({
            name: name,
            password: hashPassword,
          });
          await doc.save();
          res
            .status(201)
            .send({ status: "success", message: "Registration Success" });
        } catch (error) {
          console.log(error);
          res.send({
            status: "failed",
            message: "Unable to Register" + ` error - ${error}`,
          });
        }
      } else {
        res
          .status(404)
          .send({ status: "failed", message: "All fields are required" });
      }
    }
  };
}

export default UserController;
