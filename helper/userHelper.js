import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import fs from "fs";

class userHelper {
  static async registrationUser(name, password, role = "member") {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const doc = new UserModel({
        name: name,
        password: hashPassword,
        role: role,
      });
      await doc.save();
      const saved_user = await UserModel.findOne({ name: name });
      // Generate JWT Token
      const token = jwt.sign(
        { userID: saved_user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "5d" },
      );
      return { isSuccess: true, role: saved_user.role, token: token };
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
        ? { isSuccess: true, role: user.role, token: token }
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

  static async uploadFile(req, res) {
    try {
      const { name } = req.body;
      if (name) {
        // Update options
        const updateOptions = {
          $push: {
            uploads: `http://localhost:4000/profile/${req.file.filename}`,
          }, // Add a new value to the uploads array
        };
        const user = await UserModel.findOneAndUpdate(
          { name: name },
          updateOptions,
          { returnOriginal: false },
        );
        //console.log("user in collection ",user);
        return user ? true : false;
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({
        status: "failed",
        message: "Unable to update the fileURL in DB" + ` error - ${error} `,
      });
    }
  }

  static async getBucketList(req, res) {
    try {
      const { name } = req.body;
      if (name) {
        const folderPath = "./uploads";
        const subfolderName = `${name}`;
        const folders = fs
          .readdirSync(folderPath, { withFileTypes: true })
          .filter(
            (dirent) => dirent.isDirectory() && dirent.name === subfolderName,
          )
          .map((dirent) => dirent.name);
        //console.log("HI" ,folders);
        return folders
          ? { sizeOfBuckets: folders.length, folder: folders }
          : [];
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({
        status: "failed",
        message: "Unable to get the folder" + ` error - ${error} `,
      });
    }
  }

  static async getBucketFiles(req, res) {
    try {
      const { name } = req.body;
      if (name) {
        const folderPath = `./uploads/${name}`;
        const files = fs
          .readdirSync(folderPath, { withFileTypes: true })
          .filter((dirent) => dirent.isFile())
          .map((dirent) => dirent.name);
        //console.log("HI" ,files);
        return files ? { filesInBuckets: files.length, files: files } : [];
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({
        status: "failed",
        message: "Unable to get the file" + ` error - ${error} `,
      });
    }
  }

  static async getFileByName(req, res) {
    try {
      const { name } = req.body;
      if (name) {
        const folderPath = `./uploads/${name}`;
        const filename = req.body.filename;
        const file = fs
          .readdirSync(folderPath, { withFileTypes: true })
          .find((Objfile) => Objfile.name.includes(filename));

        const user = await UserModel.findOne({ name: name });
        const fileFromDB = user.uploads.find((file) =>
          String(file).includes(filename),
        );

        return file ? { file, fileFromDB } : [];
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({
        status: "failed",
        message: "Unable to get the file" + ` error - ${error} `,
      });
    }
  }
}

export default userHelper;
