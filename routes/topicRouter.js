const { getTopics } = require("../controllers/topics");
const { getArticlesByTopic, addArticle } = require("../controllers/articles");
const topicRouter = require("express").Router();

topicRouter.route("/").get(getTopics);

topicRouter.route("/:topic_slug/articles").get(getArticlesByTopic);

topicRouter.route("/:topic_slug/articles").post(addArticle);

module.exports = topicRouter;
