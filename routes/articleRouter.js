const {
  getArticles,
  getArticleByID,
  changeArticleVote,
  deleteArticle
} = require("../controllers/articles");
const { getCommentsByArticle, addComment } = require("../controllers/comments");
const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles);

articleRouter
  .route("/:article_id")
  .get(getArticleByID)
  .put(changeArticleVote)
  .delete(deleteArticle);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(addComment);

module.exports = articleRouter;
