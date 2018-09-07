process.env.NODE_ENV = "test";
const { expect } = require("chai");
const app = require("../app");
const request = require("supertest")(app);
const seedDB = require("../seed/seed.js");
const {
  topicData,
  userData,
  articleData,
  commentData
} = require("../seed/testData");
const mongoose = require("mongoose");

describe("/API", () => {
  let topicDocs, userDocs, articleDocs, commentDocs;
  beforeEach(() => {
    return seedDB(topicData, userData, articleData, commentData)
      .then(docs => {
        [topicDocs, userDocs, articleDocs, commentDocs] = docs;
      })
      .catch(console.log);
  });
  after(() => {
    mongoose.disconnect();
  });
  it("GET a 404 PAGE NOT FOUND when skipping the 'api' route", () => {
    return request
      .get("/tara")
      .expect(404)
      .then(res => expect(res.body.message).to.equal("ERROR! PAGE NOT FOUND"));
  });
  it("GET a 404 PAGE NOT FOUND when inputting a page which does not exist", () => {
    return request
      .get("/api/tara")
      .expect(404)
      .then(res => expect(res.body.message).to.equal("ERROR! PAGE NOT FOUND"));
  });
  describe("/topics", () => {
    it("GET / responds with all topics", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body.topics.length).to.equal(2);
          expect(res.body.topics[0]).to.have.all.keys(
            "_id",
            "title",
            "slug",
            "__v"
          );
        });
    });
    it("GET /:topic_slug/articles responds with all articles for the provided topic", () => {
      return request
        .get("/api/topics/mitch/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(2);
          expect(res.body.articles[0]).to.have.all.keys(
            "created_at",
            "belongs_to",
            "__v",
            "_id",
            "votes",
            "created_by",
            "body",
            "title",
            "comments"
          );
          expect(res.body.articles[1].title).to.equal(
            "7 inspirational thought leaders from Manchester UK"
          );
        });
    });
    it("GET /:topic_slug/articles responds with 404 and an error if given a topic slug which does not exist", () => {
      return request
        .get("/api/topics/tara/articles")
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal(
            "There are no articles under the topic of 'tara'"
          );
        });
    });
    it("POST /:topic_slug/articles responds with 201, adds the new article to the database and sends back the new article", () => {
      return request
        .post(`/api/topics/cats/articles`)
        .send({
          title: "why cats are better than dogs",
          body:
            "it's often been debated, which is truly the greatest pet? One can argue that a dog is indeed a man's best friend, they're loyal and they love unconditionally. But cat's provide a challenge. You cannot just expect love and loyalty from a cat, it must be earned.",
          created_by: `${userDocs[1]._id}`
        })
        .expect(201)
        .then(res => {
          expect(res.body.article.title).to.equal(
            "why cats are better than dogs"
          );
        });
    });
    it("POST /:topic_slug/articles responds with a 400 BAD REQUEST when not following the schema", () => {
      return request
        .post("/api/topics/cats/articles")
        .send({
          title: "why cats are better than dogs",
          created_by: `${userDocs[1]._id}`
        })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            "please include all required fields"
          );
        });
    });
    it("GET a 404 PAGE NOT FOUND when inputting a page which does not exist", () => {
      return request
        .get("/api/topics/tara")
        .expect(404)
        .then(res =>
          expect(res.body.message).to.equal("ERROR! PAGE NOT FOUND")
        );
    });
  });
  describe("/articles", () => {
    it("GET / responds with all articles", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(4);
          expect(res.body.articles[1]).to.contain.all.keys(
            "created_at",
            "belongs_to",
            "__v",
            "_id",
            "votes",
            "created_by",
            "body",
            "title"
          );
        });
    });
    it("GET /:article_id responds with the correct article by ID", () => {
      return request
        .get(`/api/articles/${articleDocs[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body.article).to.have.all.keys(
            "created_at",
            "belongs_to",
            "__v",
            "_id",
            "votes",
            "created_by",
            "body",
            "title",
            "comments"
          );
          expect(res.body.article._id).to.equal(`${articleDocs[0]._id}`);
        });
    });
    it("GET /:article_id responds with a 400 when inputting an incorrect article id", () => {
      return request
        .get("/api/articles/123tara321")
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            "invalid ID. please input with the correct format"
          );
        });
    });
    it("GET /:article_id responds with a 404 when inputting an article id which has no articles associated to it", () => {
      return request
        .get(`/api/articles/${userDocs[0]._id}`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal(
            "article id is not recognised. please try again"
          );
        });
    });
    it("GET /:article_id/comments responds with a 200 and returns all comments for the given article", () => {
      return request
        .get(`/api/articles/${articleDocs[0]._id}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body.comments.length).to.equal(2);
          expect(res.body.comments[0]).to.have.all.keys(
            "body",
            "belongs_to",
            "votes",
            "created_at",
            "_id",
            "__v",
            "created_by"
          );
        });
    });
    it("GET /:article_id/comments responds with a 400 error message when id input is wrong", () => {
      return request
        .get(`/api/articles/tara/comments`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            "invalid ID. please input with the correct format"
          );
        });
    });
    it("POST request on /api/articles/:article_id/comments posts a new comment to an article", () => {
      return request
        .post(`/api/articles/${articleDocs[2]._id}/comments`)
        .send({
          body: "what a fantastic article! I love cats!",
          created_by: `${userDocs[0]._id}`
        })
        .expect(201)
        .then(res => {
          expect(res.body.comment.body).to.equal(
            "what a fantastic article! I love cats!"
          );
        });
    });
    it("PUT request on /:article_id?vote=up increments the votes of an article by one", () => {
      return request
        .put(
          `/api/articles/${articleDocs[2]._id}?vote=up&&user_id=${
            userDocs[1]._id
          }`
        )
        .expect(202)
        .then(res => {
          expect(res.body.article.votes).to.equal(1);
        });
    });
    it("PUT request on /:article_id?vote=down decrements the votes of an article by one", () => {
      return request
        .put(
          `/api/articles/${articleDocs[2]._id}?vote=down&&user_id=${
            userDocs[1]._id
          }`
        )
        .expect(202)
        .then(res => {
          expect(res.body.article.votes).to.equal(-1);
        });
    });
  });
  describe("/comments", () => {
    it("PUT request on /:comment_id?vote=up increments the votes of a comment by one", () => {
      return request
        .put(
          `/api/comments/${commentDocs[2]._id}?vote=up&&user_id=${
            userDocs[1]._id
          }`
        )
        .expect(202)
        .then(res => {
          expect(res.body.comment.votes).to.equal(21);
        });
    });
    it("PUT request on /:comment_id?vote=down decrements the votes of a comment by one", () => {
      return request
        .put(
          `/api/comments/${commentDocs[2]._id}?vote=down&&user_id=${
            userDocs[1]._id
          }`
        )
        .expect(202)
        .then(res => {
          expect(res.body.comment.votes).to.equal(19);
        });
    });
    it("DELETEs a comment on /:comment_id and returns a 204", () => {
      return request
        .delete(`/api/comments/${commentDocs[2]._id}`)
        .expect(202)
        .then(res => {
          expect(res.body.comment.body).to.equal(
            "The owls are not what they seem."
          );
        });
    });
    it("returns a 404 when given an id not associated to a comment", () => {
      return request
        .delete(`/api/comments/${articleDocs[2]._id}`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal("comment not found");
        });
    });
  });
  describe("/users", () => {
    it("GET /:user_id returns the correct user for the input id", () => {
      return request
        .get(`/api/users/${userDocs[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body.user.username).to.equal("butter_bridge");
        });
    });
    it("GET /:user_id responds with a 400 when inputting an invalid user_id", () => {
      return request
        .get("/api/users/123tara321")
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            "invalid ID. please input with the correct format"
          );
        });
    });
    it("GET /:user_id responds with a 404 when inputting an user id which has no users associated to it", () => {
      return request
        .get(`/api/users/${articleDocs[1]._id}`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal(
            "user id is not recognised. please try again"
          );
        });
    });
  });
});
