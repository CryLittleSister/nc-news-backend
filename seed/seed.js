const mongoose = require("mongoose");
const { Topic, User, Article, Comment } = require("../models");
const { formatArticleData, formatCommentData } = require("../utils/index.js");

const seedDB = (topicData, userData, articleData, commentData) => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      return Promise.all([
        Topic.insertMany(topicData),
        User.insertMany(userData)
      ]);
    })
    .then(([topicDocs, userDocs]) => {
      const formattedArticleData = formatArticleData(
        articleData,
        topicDocs,
        userDocs
      );
      return Promise.all([
        topicDocs,
        userDocs,
        Article.insertMany(formattedArticleData)
      ]);
    })
    .then(([topicDocs, userDocs, articleDocs]) => {
      const formattedCommentData = formatCommentData(
        commentData,
        articleDocs,
        userDocs
      );
      return Promise.all([
        topicDocs,
        userDocs,
        articleDocs,
        Comment.insertMany(formattedCommentData)
      ]);
    });
};

module.exports = seedDB;
