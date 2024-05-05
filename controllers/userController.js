import userHelper from "../helper/userHelper.js";
import UserModel from "../models/User.js";

class UserController {
  static userRegistration = async (req, res) => {
    const { name, password, role } = req.body;
    const user = await UserModel.findOne({ name: name });
    if (user) {
      res
        .status(404)
        .send({ status: "failed", message: "Username already exists" });
    } else {
      if (name && password) {
        const isSaved = await userHelper.registrationUser(name, password, role);

        isSaved.isSuccess == true
          ? res.status(201).send({
              status: "success",
              message: "Registration Success",
              role: isSaved.role,
              Token: isSaved.token,
            })
          : res.status(404).send({ data: isSaved });
      } else {
        res
          .status(404)
          .send({ status: "failed", message: "All fields are required" });
      }
    }
  };

  static userLogin = async (req, res) => {
    try {
      const { name, password } = req.body;
      if (name && password) {
        const user = await UserModel.findOne({ name: name });
        if (user != null) {
          const isLoggedIn = await userHelper.loginUser(name, password, user);

          isLoggedIn.isSuccess == true
            ? res.status(200).send({
                status: "success",
                message: "Login Success",
                role: isLoggedIn.role,
                Token: isLoggedIn.token,
              })
            : res.status(401).send({ data: isLoggedIn });
        } else {
          res.status(404).send({
            status: "failed",
            message: "You are not a Registered User",
          });
        }
      } else {
        res
          .status(404)
          .send({ status: "failed", message: "All Fields are Required" });
      }
    } catch (error) {
      console.log(error);
      res.status(404).send({
        status: "failed",
        message: "Unable to Login" + ` error - ${error} `,
      });
    }
  };

  static loggedUser = async (req, res) => {
    res.send({ user: req.user });
  };

  static transactionLogs = async (req, res) => {
    res.send({ data: { isAdmin: true } });
  };

  static UploadFile = async (req, res) => {
    const isUploaded = await userHelper.uploadFile(req, res);

    isUploaded
      ? res.json({
          success: 1,
          profile_url: `http://localhost:4000/profile/${req.file.filename}`,
          isUploaded: isUploaded,
        })
      : res.json({ success: 0, message: "Unable to Upload" });
  };

  static getBucketList = async (req, res) => {
    const bucketList = await userHelper.getBucketList(req, res);
    return bucketList.sizeOfBuckets > 0
      ? res.send(bucketList)
      : res.send({ message: "No buckets found" });
  };

  static getBucketFiles = async (req, res) => {
    const bucketFiles = await userHelper.getBucketFiles(req, res);
    return bucketFiles.filesInBuckets > 0
      ? res.send(bucketFiles)
      : res.send({ message: "No buckets found" });
  };

  static getFileByName = async (req, res) => {
    const bucketFile = await userHelper.getFileByName(req, res);
    return bucketFile
      ? res.send(bucketFile)
      : res.send({ message: "No File found" });
  };

  static deleteFile = async (req, res) => {
    const isDeleted = await userHelper.deleteFile(req, res);
    return isDeleted
      ? res.send({ isDeleted, message: "Deleted Successfully" })
      : res.send({ message: "Could not delete File" });
  };
}

export default UserController;
