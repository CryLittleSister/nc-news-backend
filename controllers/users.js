const { User } = require("../models");

const getUsers = (req, res, next) => {
  User.find()
    .then(users => res.status(200).send({ users }))
    .catch(next);
};

const getUserByID = (req, res, next) => {
  User.findById(req.params.user_id)
    .then(user => {
      user === null
        ? next({
            status: 404,
            message: "user id is not recognised. please try again"
          })
        : res.status(200).send({ user });
    })
    .catch(err => next(err));
};

const addUser = (req, res, next) => {
  if (
    !["username", "password", "name"].every(key => req.body.hasOwnProperty(key))
  ) {
    next({ status: 400, message: "please include all required fields" });
  } else {
    if (!req.body.avatar_url)
      req.body.avatar_url =
        "http://www.landstromcenter.com/Websites/landstromcenter/images/staff/placeholder.jpg";
    req.body.votes = { articles: {}, comments: {} };
    User.create(req.body)
      .then(user => res.status(201).send({ user }))
      .catch(err => next(err));
  }
};

module.exports = { getUserByID, getUsers, addUser };
