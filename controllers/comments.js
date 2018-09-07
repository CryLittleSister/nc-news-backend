const { Comment, User } = require("../models");

const getCommentsByArticle = (req, res, next) => {
  Comment.find({ belongs_to: req.params.article_id })
    .then(comments => {
      comments.length === 0
        ? next({ status: 400, message: "no articles found with that id" })
        : res.status(200).send({ comments });
    })
    .catch(err => next(err));
};

const addComment = (req, res, next) => {
  !["body", "created_by"].every(key => req.body.hasOwnProperty(key))
    ? next({ status: 400, message: "please include all required fields" })
    : (req.body.belongs_to = req.params.article_id);
  const newComment = new Comment(req.body);
  Comment.create(newComment)
    .then(comment => res.status(201).send({ comment }))
    .catch(err => next(err));
};

const changeCommentVote = (req, res, next) => {
  let num = req.query.vote === "up" ? 1 : -1;
  let key = `votes.comments.${req.params.comment_id}`;
  let newObj = {};

  Comment.findByIdAndUpdate(
    req.params.comment_id,
    { $inc: { votes: num } },
    { new: true }
  )
    .then(comment => {
      newObj[key] = !req.query.undo ? num : 0;
      if (!comment)
        next({
          status: 404,
          message: "comment id is not recognised. please try again"
        });
      else {
        return Promise.all([
          comment,
          User.findByIdAndUpdate(
            req.query.user_id,
            { $set: newObj },
            { new: true }
          )
        ]);
      }
    })
    .then(([comment, user]) => {
      if (!user)
        next({
          status: 404,
          message: "user id is not recognised. please try again"
        });
      else res.status(202).send({ comment, user });
    })
    .catch(err => next(err));
};

const deleteComment = (req, res, next) => {
  Comment.findByIdAndRemove(req.params.comment_id)
    .then(comment => {
      comment === null
        ? next({ status: 404, message: "comment not found" })
        : res.status(202).send({ comment });
    })
    .catch(err => next(err));
};

module.exports = {
  getCommentsByArticle,
  addComment,
  changeCommentVote,
  deleteComment
};
