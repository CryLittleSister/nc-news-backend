const { Article, Topic, Comment, User } = require("../models");

const getArticles = (req, res, next) => {
  Article.find()
    .lean()
    .then(articles => Promise.all([articles, Comment.find().lean()]))
    .then(([articles, comments]) => {
      const artiCount = articles.map(article => {
        let count = 0;
        comments.forEach(comment => {
          if (comment.belongs_to.toString() === article._id.toString()) count++;
        });
        const updatedArticle = { ...article, comments: count };
        return updatedArticle;
      });
      res.status(200).send({ articles: artiCount });
    })
    .catch(console.log);
};

const getArticleByID = (req, res, next) => {
  Article.findById(req.params.article_id)
    .then(article => Promise.all([article, Comment.find().lean()]))
    .then(([article, comments]) => {
      if (article === null)
        next({
          status: 404,
          message: "article id is not recognised. please try again"
        });
      else {
        let count = 0;
        comments.forEach(comment => {
          if (comment.belongs_to.toString() === article._id.toString()) count++;
        });
        const tt = { ...article };
        updatedArticle = { ...tt._doc, comments: count };
        res.status(200).send({ article: updatedArticle });
      }
    })
    .catch(err => next(err));
};

const getArticlesByTopic = (req, res, next) => {
  Article.find({ belongs_to: `${req.params.topic_slug}` })
    .lean()
    .then(articles => Promise.all([articles, Comment.find().lean()]))
    .then(([articles, comments]) => {
      if (articles.length === 0)
        next({
          status: 404,
          message: `There are no articles under the topic of '${
            req.params.topic_slug
          }'`
        });
      else {
        const artiCount = articles.map(article => {
          let count = 0;
          comments.forEach(comment => {
            if (comment.belongs_to.toString() === article._id.toString())
              count++;
          });
          const updatedArticle = { ...article, comments: count };
          return updatedArticle;
        });
        res.status(200).send({ articles: artiCount });
      }
    })
    .catch(err => {
      next(err);
    });
};

const addArticle = (req, res, next) => {
  !["title", "body", "created_by"].every(key => req.body.hasOwnProperty(key))
    ? next({ status: 400, message: "please include all required fields" })
    : (req.body.belongs_to = req.params.topic_slug);
  const newArticle = new Article(req.body);
  Article.create(newArticle)
    .then(article => res.status(201).send({ article }))
    .catch(err => next(err));
};

const changeArticleVote = (req, res, next) => {
  let num = req.query.vote === "up" ? 1 : -1;

  let key = `votes.articles.${req.params.article_id}`;
  let newObj = {};

  Article.findByIdAndUpdate(
    req.params.article_id,
    { $inc: { votes: num } },
    { new: true }
  )
    .then(article => {
      newObj[key] = !req.query.undo ? num : 0;
      if (!article)
        next({
          status: 404,
          message: "article id is not recognised. please try again"
        });
      else {
        return Promise.all([
          article,
          User.findByIdAndUpdate(
            req.query.user_id,
            { $set: newObj },
            { new: true }
          )
        ]);
      }
    })
    .then(([article, user]) => {
      if (!user)
        next({
          status: 404,
          message: "user id is not recognised. please try again"
        });
      else res.status(202).send({ article, user });
    })
    .catch(err => next(err));
};

const deleteArticle = (req, res, next) => {
  Article.findByIdAndRemove(req.params.article_id)
    .then(
      article =>
        !article
          ? next({ status: 404, message: "article not found" })
          : res.status(202).send({ article })
    )
    .catch(err => next(err));
};

module.exports = {
  getArticlesByTopic,
  getArticles,
  getArticleByID,
  addArticle,
  changeArticleVote,
  deleteArticle
};
