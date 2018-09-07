const usernameToID = (data, userDocs) => {
  userDocs.forEach(user => {
    if (data.created_by === user.username) data.created_by = user._id;
  });
  return data;
};

const formatArticleData = (articleData, topicDocs, userDocs) => {
  articleData.map(article => {
    usernameToID(article, userDocs);
    article.belongs_to = article.topic;
  });
  return articleData;
};

const formatCommentData = (commentData, articleDocs, userDocs) => {
  return commentData.map(comment => {
    usernameToID(comment, userDocs);
    const article_id = articleDocs.find(
      article => comment.belongs_to === article.title
    )._id;
    return { ...comment, belongs_to: article_id };
  });
};

const addCommentCount = (articleDocs, commentDocs) => {
  return articleDocs.map(article => {
    const comments = 0;
    commentDocs.forEach(comments => {
      if (comments.belongs_to === article._id) comments++;
    });
    article.comments = comments;
    return article;
  });
};

module.exports = {
  formatArticleData,
  formatCommentData,
  addCommentCount
};
