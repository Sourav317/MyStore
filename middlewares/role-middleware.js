import UserModel from "../models/User.js";

var requireRole = async (req, res, next) => {
  const { name } = req.body;
  const user = await UserModel.findOne({ name: name });
  if (user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .send({
        status: "failed",
        message: "You are not authorized to visit this Route, Must be Admin",
      });
  }
};

export default requireRole;
