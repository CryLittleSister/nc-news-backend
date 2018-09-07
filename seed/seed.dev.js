const seedDB = require("./seed");
const mongoose = require("mongoose");
const { topicData, userData, articleData, commentData } = require("./devData");
const { DB_URL } =
  process.env.NODE_ENV === "production" ? process.env : require("../config");

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log(`connected to ${DB_URL}`);
    return seedDB(topicData, userData, articleData, commentData);
  })
  .then(() => mongoose.disconnect());
