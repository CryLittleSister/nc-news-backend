const { getUserByID, getUsers, addUser } = require("../controllers/users");
const userRouter = require("express").Router();

userRouter
  .route("/")
  .get(getUsers)
  .post(addUser);
userRouter.route("/:user_id").get(getUserByID);

module.exports = userRouter;
