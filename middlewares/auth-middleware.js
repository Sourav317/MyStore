import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

var checkUserAuth = async (req, res, next) => {
  let token;
  const { name } = req.body;

  if (name) {
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
      try {
        // Get Token from header
        token = authorization.split(" ")[1];

        // Verify Token
        const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Get User from Token
        let user = await UserModel.findById(userID).select("-password");

        // Check if user is valid by checking username provided in payload with database entry
        if (name !== user.name) {
          throw new Error("Unauthorized User");
        }

        req.user = user;
        next();
      } catch (error) {
        console.log(error);
        res
          .status(401)
          .send({ status: "failed", message: "Unauthorized User" });
      }
    }
  } else {
    res
      .status(401)
      .send({ status: "failed", message: "Please provide username" });
  }
  if (!token) {
    res
      .status(401)
      .send({ status: "failed", message: "Unauthorized User, No Token" });
  }
};

export default checkUserAuth;
