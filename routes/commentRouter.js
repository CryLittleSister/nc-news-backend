const { changeCommentVote, deleteComment } = require("../controllers/comments");
const commentRouter = require("express").Router();

commentRouter
  .route("/:comment_id")
  .put(changeCommentVote)
  .delete(deleteComment);

module.exports = commentRouter;
