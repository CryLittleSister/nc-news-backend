const userRouter = require("./userRouter");
const articleRouter = require("./articleRouter");
const commentRouter = require("./commentRouter");
const topicRouter = require("./topicRouter");

const apiRouter = require("express").Router();

apiRouter.route("/").get((req, res) => {
  res.render("home");
});

apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/topics", topicRouter);

module.exports = apiRouter;
